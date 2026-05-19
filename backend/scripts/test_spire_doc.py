import sys
from spire.doc import *

try:
    document = Document()
    document.LoadFromFile("test_excel_temp.docx")
    document.SaveToFile("test_output2.odt", FileFormat.Odt)
    print("Success")
except Exception as e:
    print("Error:", e)
