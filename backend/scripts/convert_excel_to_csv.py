import sys
import os
import pandas as pd

def convert_to_csv(input_path, output_path):
    input_path = os.path.abspath(input_path)
    output_path = os.path.abspath(output_path)

    try:
        # Read Excel file treating all columns as strings and no header
        # dtype=str prevents pandas from interpreting numbers/dates and potentially changing them
        # header=None ensures the first row is treated as data, not header
        df = pd.read_excel(input_path, header=None, dtype=str)
        
        # Replace NaN/None with empty string to match original "empty" cells
        df = df.fillna("")
        
        # Write to CSV without index and without header (since we read without header)
        df.to_csv(output_path, index=False, header=False, encoding='utf-8')
        
        print(f"Successfully converted {input_path} to {output_path}")
    except Exception as e:
        print(f"Error converting {input_path}: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert_excel_to_csv.py <input_xlsx> <output_csv>")
        sys.exit(1)

    convert_to_csv(sys.argv[1], sys.argv[2])
