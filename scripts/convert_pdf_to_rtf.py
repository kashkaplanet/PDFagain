import sys
import os
import subprocess
import shutil

# This script relies on pdf2docx for initial conversion, then LibreOffice/Word for final format.
try:
    from pdf2docx import Converter
except ImportError:
    print("Error: pdf2docx not installed. Run `pip install pdf2docx`.")
    sys.exit(1)

def convert_to_rtf(pdf_path, output_rtf_path):
    pdf_path = os.path.abspath(pdf_path)
    output_rtf_path = os.path.abspath(output_rtf_path)
    
    # 1. Convert PDF to DOCX using pdf2docx
    # Use a unique temp name to avoid collisions
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    temp_docx = os.path.join(os.path.dirname(output_rtf_path), f"{base_name}_temp_rtf.docx")
    
    try:
        print(f"Converting PDF to DOCX: {pdf_path} -> {temp_docx}")
        cv = Converter(pdf_path)
        cv.convert(temp_docx, start=0, end=None)
        cv.close()
    except Exception as e:
        print(f"Error converting PDF to DOCX: {e}")
        if os.path.exists(temp_docx):
            os.remove(temp_docx)
        sys.exit(1)

    if not os.path.exists(temp_docx):
        print("Error: Intermediate DOCX file was not created.")
        sys.exit(1)

    # 2. Convert DOCX to RTF using LibreOffice or Word
    print(f"Converting DOCX to RTF: {temp_docx} -> {output_rtf_path}")
    
    # Try LibreOffice first
    soffice_path = None
    possible_paths = [
        r"C:\Program Files\LibreOffice\program\soffice.exe",
        r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
        "soffice",
        "libreoffice",
    ]
    
    for path in possible_paths:
        if shutil.which(path):
             soffice_path = path
             break
        elif os.path.isfile(path):
            soffice_path = path
            break
            
    if soffice_path:
        output_dir = os.path.dirname(output_rtf_path)
        try:
            # libreoffice --headless --convert-to rtf --outdir ...
            print(f"Using LibreOffice at {soffice_path}")
            subprocess.run([soffice_path, "--headless", "--convert-to", "rtf", "--outdir", output_dir, temp_docx], check=True, capture_output=True)
            
            # LibreOffice output filename handling: it creates [basename].rtf
            generated_rtf = os.path.splitext(temp_docx)[0] + ".rtf"
            
            if os.path.exists(generated_rtf):
                if generated_rtf != output_rtf_path:
                    if os.path.exists(output_rtf_path):
                        os.remove(output_rtf_path)
                    os.rename(generated_rtf, output_rtf_path)
                
                print(f"Successfully converted to {output_rtf_path}")
                # Cleanup
                if os.path.exists(temp_docx):
                    os.remove(temp_docx)
                return
            else:
                 print(f"LibreOffice finished but output {generated_rtf} not found?")

        except Exception as e:
            print(f"LibreOffice conversion failed: {e}")

    # Fallback to MS Word (Windows)
    try:
        import pythoncom
        import win32com.client
        
        print("Using MS Word for conversion...")
        pythoncom.CoInitialize()
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False
        
        try:
            # Open the DOCX
            doc = word.Documents.Open(temp_docx)
            # Save as RTF. wdFormatRTF = 6
            doc.SaveAs2(output_rtf_path, FileFormat=6)
            doc.Close()
            word.Quit()
            
            print(f"Successfully converted to {output_rtf_path}")
            # Cleanup
            if os.path.exists(temp_docx):
                os.remove(temp_docx)
            return
            
        except Exception as e:
            print(f"Word conversion failed: {e}")
            try:
                doc.Close()
                word.Quit()
            except:
                pass
            
    except ImportError:
        print("win32com not found.")
    except Exception as e:
        print(f"Word dispatch failed: {e}")

    # If we reached here, both methods failed
    print("Error: Could not convert DOCX to RTF. Install LibreOffice or MS Word.")
    # Clean up temp file
    if os.path.exists(temp_docx):
         try:
            os.remove(temp_docx)
         except:
            pass
    sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert_pdf_to_rtf.py <input_pdf> <output_rtf>")
        sys.exit(1)
        
    convert_to_rtf(sys.argv[1], sys.argv[2])
