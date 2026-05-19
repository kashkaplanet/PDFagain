try:
    import pandas as pd
    print("pandas found")
except ImportError:
    print("pandas NOT found")

try:
    import openpyxl
    print("openpyxl found")
except ImportError:
    print("openpyxl NOT found")

try:
    import pdfplumber
    print("pdfplumber found")
except ImportError:
    print("pdfplumber NOT found")
