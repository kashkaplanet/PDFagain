import sys
import os
import win32com.client
import pythoncom

def convert_to_pdf(input_path, output_path):
    """
    Converts an Excel file to PDF using win32com.
    """
    input_path = os.path.abspath(input_path)
    output_path = os.path.abspath(output_path)

    if not os.path.exists(input_path):
        print(f"Error: Input file does not exist: {input_path}")
        return False

    print(f"Converting {input_path} to {output_path}...")

    # Initialize COM setup for this thread
    pythoncom.CoInitialize()
    
    excel = None
    wb = None
    
    try:
        excel = win32com.client.Dispatch("Excel.Application")
        try:
            excel.Visible = False
        except:
            pass
        excel.DisplayAlerts = False
        
        # Open workbook
        import time
        wb = excel.Workbooks.Open(input_path)
        time.sleep(2) # Wait for Excel to settle
        
        # Configure Page Setup with retry logic
        for i in range(3):
            try:
                for ws in wb.Worksheets:
                    # Unmerge all cells to ensure AutoFit works correctly
                    # try:
                    #     ws.Cells.UnMerge()
                    # except Exception as e:
                    #      print(f"  Warning: UnMerge failed for sheet '{ws.Name}': {e}")

                    # Clear PrintArea
                    ws.PageSetup.PrintArea = ""
                    
                    # AutoFit columns and rows to prevent overlapping text
                    # try:
                    #     ws.Columns.AutoFit()
                    #     ws.Rows.AutoFit()
                    # except Exception as e:
                    #     print(f"  Warning: AutoFit failed for sheet '{ws.Name}': {e}")
                    
                    # Check used range width
                    used_width = ws.UsedRange.Width
                    print(f"Sheet '{ws.Name}' Used Width: {used_width} points")

                    ws.PageSetup.Zoom = False
                    ws.PageSetup.FitToPagesWide = 1
                    ws.PageSetup.FitToPagesTall = False
                    
                    if used_width > 850:
                        print(f"  -> Selecting A3 Landscape")
                        ws.PageSetup.PaperSize = 8 # xlPaperA3
                        ws.PageSetup.Orientation = 2 # xlLandscape
                    elif used_width > 550:
                        print(f"  -> Selecting A4 Landscape")
                        ws.PageSetup.PaperSize = 9 # xlPaperA4
                        ws.PageSetup.Orientation = 2 # xlLandscape
                    else:
                        print(f"  -> Selecting A4 Portrait")
                        ws.PageSetup.PaperSize = 9 # xlPaperA4
                        ws.PageSetup.Orientation = 1 # xlPortrait
                        
                    ws.PageSetup.CenterHorizontally = True
                break # Success, exit retry loop
            except Exception as e:
                print(f"PageSetup failed (attempt {i+1}/3): {e}")
                time.sleep(2)
        
        # xlTypePDF = 0
        # Retry logic for export
        max_retries = 3
        for i in range(max_retries):
            try:
                wb.ExportAsFixedFormat(0, output_path)
                print(f"Successfully converted to {output_path}")
                return True
            except Exception as e:
                if i == max_retries - 1:
                    raise e
                print(f"Export failed, retrying ({i+1}/{max_retries})... Error: {e}")
                time.sleep(2)
        
    except Exception as e:
        print(f"Error during conversion: {e}")
        return False
        
    finally:
        if wb:
            try:
                wb.Close(SaveChanges=False)
            except:
                pass
        if excel:
            try:
                excel.Quit()
            except:
                pass
        pythoncom.CoUninitialize()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert_excel_to_pdf.py <input_excel> <output_pdf>")
        sys.exit(1)
        
    success = convert_to_pdf(sys.argv[1], sys.argv[2])
    sys.exit(0 if success else 1)
