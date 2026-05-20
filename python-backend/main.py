import os
import shutil
import subprocess
import uuid
import json
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List

app = FastAPI(title="Pdfagain Python Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = os.path.join(os.getcwd(), "tmp")
SCRIPTS_DIR = os.path.join(os.getcwd(), "scripts")

if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

@app.get("/health")
def health_check():
    return {"status": "ok", "backend": "python"}

@app.post("/api/run-script")
async def run_script(
    file: UploadFile = File(...),
    script: str = Form(...),
    inputExt: str = Form(...),
    outputExt: str = Form(...),
    args: Optional[str] = Form("[]")  # JSON encoded list of args
):
    try:
        parsed_args = json.loads(args)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid args format, must be JSON array")

    script_path = os.path.join(SCRIPTS_DIR, script)
    if not os.path.exists(script_path):
        raise HTTPException(status_code=400, detail=f"Script not found: {script}")

    req_id = str(uuid.uuid4())
    input_path = os.path.join(TEMP_DIR, f"{req_id}{inputExt}")
    output_path = os.path.join(TEMP_DIR, f"{req_id}{outputExt}")

    # Save uploaded file
    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save input file: {e}")

    # Run Python script
    cmd = ["python", script_path, input_path, output_path] + parsed_args
    print(f"Running command: {' '.join(cmd)}")

    try:
        process = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        
        if process.returncode != 0 or not os.path.exists(output_path):
            error_msg = process.stderr or process.stdout or "Unknown error"
            print(f"Command failed: {error_msg}")
            raise HTTPException(status_code=500, detail=f"Script failed: {error_msg}")

        # Return the output file
        # Note: We can't delete the file immediately because FileResponse needs to read it.
        # FastAPI's FileResponse doesn't have a built-in delete-after-send, but we can use background tasks
        # Or let a cron/cleanup job handle it. We will use a BackgroundTask.
        from fastapi.background import BackgroundTasks
        
        def cleanup():
            try:
                if os.path.exists(input_path): os.remove(input_path)
                if os.path.exists(output_path): os.remove(output_path)
            except:
                pass
                
        # We need to return it, we will clean up in the next step
        # Wait, if we use BackgroundTasks it will run AFTER the response is sent
        from starlette.background import BackgroundTask
        return FileResponse(
            path=output_path, 
            filename=f"output{outputExt}",
            background=BackgroundTask(cleanup)
        )

    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Script execution timed out")
    except Exception as e:
        if not isinstance(e, HTTPException):
            raise HTTPException(status_code=500, detail=str(e))
        raise e
    finally:
        # We only clean up input_path here if it fails. If it succeeds, BackgroundTask cleans it up.
        pass
