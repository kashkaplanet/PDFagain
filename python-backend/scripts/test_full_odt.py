import os
import sys
from pdf2docx import Converter
from spire.doc import *

def convert(pdf_path, odt_path):
    pdf_path = os.path.abspath(pdf_path)
    odt_path = os.path.abspath(odt_path)
    
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    temp_docx = os.path.join(os.path.dirname(odt_path), f"{base_name}_temp.docx")
    
    print(f"Converting PDF to DOCX: {pdf_path} -> {temp_docx}")
    cv = Converter(pdf_path)
    cv.convert(temp_docx, start=0, end=None)
    cv.close()
    
    print(f"Converting DOCX to ODT: {temp_docx} -> {odt_path}")
    document = Document()
    document.LoadFromFile(temp_docx)
    document.SaveToFile(odt_path, FileFormat.Odt)
    document.Close()
    
    if os.path.exists(temp_docx):
        os.remove(temp_docx)
    
    print("Successfully created ODT file!")

if __name__ == '__main__':
    convert("test_excel.pdf", "test_output_final.odt")
