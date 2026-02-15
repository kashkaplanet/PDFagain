import sys
import os
import subprocess

def convert_to_pdf(input_path, output_path):
    input_path = os.path.abspath(input_path)
    output_path = os.path.abspath(output_path)
    output_dir = os.path.dirname(output_path)
    
    # Try LibreOffice first (cross-platform)
    try:
        # Find LibreOffice executable
        soffice = None
        possible_paths = [
            r"C:\Program Files\LibreOffice\program\soffice.exe",
            r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
            "soffice",  # If in PATH
            "libreoffice",  # Linux/Mac
        ]
        
        for path in possible_paths:
            if os.path.isfile(path):
                soffice = path
                break
        
        if soffice is None:
            # Try running from PATH
            soffice = "soffice"
        
        result = subprocess.run(
            [soffice, "--headless", "--convert-to", "pdf", "--outdir", output_dir, input_path],
            capture_output=True,
            text=True,
            timeout=120
        )
        
        # LibreOffice outputs with the same base name
        base_name = os.path.splitext(os.path.basename(input_path))[0]
        generated_pdf = os.path.join(output_dir, base_name + ".pdf")
        
        if os.path.isfile(generated_pdf):
            # Rename to expected output path if different
            if generated_pdf != output_path:
                os.rename(generated_pdf, output_path)
            print(f"Successfully converted {input_path} to {output_path}")
            return
        else:
            print(f"LibreOffice stdout: {result.stdout}")
            print(f"LibreOffice stderr: {result.stderr}")
            raise Exception("LibreOffice conversion did not produce output file")
            
    except FileNotFoundError:
        print("LibreOffice not found, trying Word automation...")
    except Exception as e:
        print(f"LibreOffice conversion failed: {e}")
        print("Falling back to Word automation...")
    
    # Fallback: Try Microsoft Word (Windows only)
    try:
        import pythoncom
        import win32com.client
        
        pythoncom.CoInitialize()
        
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False
        
        try:
            doc = word.Documents.Open(input_path, False, True)
            # wdFormatPDF = 17
            doc.SaveAs(output_path, 17)
            doc.Close()
            print(f"Successfully converted {input_path} to {output_path}")
        except Exception as e:
            print(f"Error during Word conversion: {e}")
            sys.exit(1)
        finally:
            word.Quit()
    except ImportError:
        print("Error: Neither LibreOffice nor Microsoft Word (win32com) is available.")
        print("Please install LibreOffice or pywin32 for ODT to PDF conversion.")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert_odt.py <input_odt> <output_pdf>")
        sys.exit(1)
        
    convert_to_pdf(sys.argv[1], sys.argv[2])
