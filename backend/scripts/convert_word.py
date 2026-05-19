import sys
import os
import win32com.client

def convert_to_pdf(input_path, output_path):
    input_path = os.path.abspath(input_path)
    output_path = os.path.abspath(output_path)
    
    import pythoncom
    pythoncom.CoInitialize()
    
    word = win32com.client.Dispatch("Word.Application")
    word.Visible = False
    
    try:
        # Open(FileName, ConfirmConversions, ReadOnly, ...)
        doc = word.Documents.Open(input_path, False, True)
        # SaveAs(FileName, FileFormat, ...)
        # wdFormatPDF = 17
        doc.SaveAs(output_path, 17)
        doc.Close()
        print(f"Successfully converted {input_path} to {output_path}")
    except Exception as e:
        print(f"Error during conversion: {e}")
        sys.exit(1)
    finally:
        word.Quit()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert_word.py <input_docx> <output_pdf>")
        sys.exit(1)
        
    convert_to_pdf(sys.argv[1], sys.argv[2])
