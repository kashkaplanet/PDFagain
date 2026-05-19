import sys
import os
import shutil

try:
    from pdf2docx import Converter
except ImportError:
    print("Error: pdf2docx not installed. Run `pip install pdf2docx`.")
    sys.exit(1)

try:
    from spire.doc import *
except ImportError:
    print("Error: Spire.Doc not installed. Run `pip install Spire.Doc`.")
    sys.exit(1)

def convert_to_odt(pdf_path, output_odt_path):
    pdf_path = os.path.abspath(pdf_path)
    output_odt_path = os.path.abspath(output_odt_path)
    
    if not os.path.exists(pdf_path):
        print(f"Error: Input file {pdf_path} not found.")
        sys.exit(1)

    # 1. Convert PDF to DOCX using pdf2docx
    # Use a unique temp name to avoid collisions
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    temp_docx = os.path.join(os.path.dirname(output_odt_path), f"{base_name}_temp.docx")
    
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

    # 2. Convert DOCX to ODT using Spire.Doc
    print(f"Converting DOCX to ODT: {temp_docx} -> {output_odt_path}")
    
    try:
        document = Document()
        document.LoadFromFile(temp_docx)
        document.SaveToFile(output_odt_path, FileFormat.Odt)
        document.Close()
        
        print(f"Successfully converted to {output_odt_path}")
    except Exception as e:
        print(f"Error converting DOCX to ODT via Spire.Doc: {e}")
        if os.path.exists(temp_docx):
            os.remove(temp_docx)
        sys.exit(1)

    # Cleanup
    if os.path.exists(temp_docx):
        try:
            os.remove(temp_docx)
        except:
            pass

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert_pdf_to_odt.py <input_pdf> <output_odt>")
        sys.exit(1)
        
    convert_to_odt(sys.argv[1], sys.argv[2])
