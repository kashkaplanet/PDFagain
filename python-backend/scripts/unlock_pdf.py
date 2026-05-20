import sys
from PyPDF2 import PdfReader, PdfWriter

def unlock_pdf(input_path, output_path, password=""):
    try:
        reader = PdfReader(input_path)
        
        if reader.is_encrypted:
            # reader.decrypt returns: 0 (failed), 1 (user matched), 2 (owner matched)
            res = reader.decrypt(password)
            if res == 0:
                # If the password is empty, it means we're trying to unlock a PDF with empty password
                # PyPDF2 decrypt returns 0 if incorrect.
                print("Error: Invalid password or PDF is strongly encrypted and requires the correct password.", file=sys.stderr)
                sys.exit(1)

        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)

        with open(output_path, "wb") as f:
            writer.write(f)
            
        print("Success")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: unlock_pdf.py <input> <output> [password]", file=sys.stderr)
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    password = sys.argv[3] if len(sys.argv) > 3 else ""
    
    unlock_pdf(input_file, output_file, password)
