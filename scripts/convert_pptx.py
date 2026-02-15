import sys
import os
import comtypes.client

def convert_to_pdf(input_path, output_path):
    input_path = os.path.abspath(input_path)
    output_path = os.path.abspath(output_path)
    
    # Initialize COM library
    # For comtypes, this is often handled automatically but good to be explicit if needed
    # comtypes.CoInitialize() 
    
    powerpoint = comtypes.client.CreateObject("PowerPoint.Application")
    
    # Make sure PowerPoint is visible (sometimes required for it to work properly)
    # powerpoint.Visible = 1
    
    try:
        # Open(FileName, ReadOnly, Untitled, WithWindow)
        # ReadOnly=msoTrue (-1), Untitled=msoTrue (-1), WithWindow=msoFalse (0)
        presentation = powerpoint.Presentations.Open(input_path, True, True, False)
        
        # ExportAsFixedFormat(Path, FixedFormatType, Intent, ...)
        # FixedFormatType=ppFixedFormatTypePDF (2), Intent=ppFixedFormatIntentScreen (1)
        presentation.ExportAsFixedFormat(output_path, 2, 1)
        presentation.Close()
        print(f"Successfully converted {input_path} to {output_path}")
    except Exception as e:
        print(f"Error during conversion: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        try:
            powerpoint.Quit()
        except:
            pass

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert_pptx.py <input_pptx> <output_pdf>")
        sys.exit(1)
        
    convert_to_pdf(sys.argv[1], sys.argv[2])
