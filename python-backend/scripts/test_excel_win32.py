import win32com.client
import sys

def test_excel():
    try:
        excel = win32com.client.Dispatch("Excel.Application")
        excel.Visible = False
        print("Successfully initialized Excel application.")
        excel.Quit()
        return True
    except Exception as e:
        print(f"Failed to initialize Excel: {e}")
        return False

if __name__ == "__main__":
    if test_excel():
        sys.exit(0)
    else:
        sys.exit(1)
