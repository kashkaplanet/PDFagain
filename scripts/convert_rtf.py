import sys
import os
import win32com.client

def convert_rtf_to_pdf(input_path, output_path):
    input_path = os.path.abspath(input_path)
    output_path = os.path.abspath(output_path)
    
    # Initialize COM
    import pythoncom
    pythoncom.CoInitialize()
    
    word = None
    doc = None
    
    try:
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False
        
        # Open the RTF file
        # params: FileName, ConfirmConversions, ReadOnly, AddToRecentFiles, ...
        doc = word.Documents.Open(input_path, False, True, False)
        
        # wdFormatPDF = 17
        doc.SaveAs(output_path, 17)
        
        print(f"Successfully converted {input_path} to {output_path}")
        
    except Exception as e:
        print(f"Error during conversion: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        if doc:
            doc.Close(False) # Close without saving changes to original
        if word:
            word.Quit()
        pythoncom.CoUninitialize()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert_rtf.py <input_rtf> <output_pdf>")
        sys.exit(1)
        
    convert_rtf_to_pdf(sys.argv[1], sys.argv[2])
