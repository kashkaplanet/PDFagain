import sys
from PyPDF2 import PdfReader, PdfWriter

def protect_pdf(input_path, output_path, password):
    try:
        reader = PdfReader(input_path)
        writer = PdfWriter()

        for page in reader.pages:
            writer.add_page(page)

        # Encrypt the PDF using AES-256
        writer.encrypt(user_password=password, owner_password=password, algorithm="AES-256")

        with open(output_path, "wb") as f:
            writer.write(f)
            
        print("Success")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: protect_pdf.py <input> <output> <password>", file=sys.stderr)
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    password = sys.argv[3]
    
    protect_pdf(input_file, output_file, password)
