import argparse
import os
import sys
from pdf2image import convert_from_path
import pdfplumber
import pandas as pd

def convert_to_excel(pdf_path, output_xlsx):
    """Convert PDF tables to Excel using pdfplumber and pandas."""
    print(f"Converting {pdf_path} to {output_xlsx}...")
    
    with pdfplumber.open(pdf_path) as pdf:
        all_tables = []
        # Create Excel writer object
        # We need to make sure we have at least one sheet
        with pd.ExcelWriter(output_xlsx, engine='openpyxl') as writer:
            tables_found = False
            for i, page in enumerate(pdf.pages):
                tables = page.extract_tables()
                if not tables:
                    continue
                    
                tables_found = True
                for j, table in enumerate(tables):
                    if not table:
                        continue
                    
                    # Create DataFrame. Use first row as header if > 1 row
                    if len(table) > 1:
                        df = pd.DataFrame(table[1:], columns=table[0])
                    else:
                        df = pd.DataFrame(table)

                    # Excel sheet names limited to 31 chars
                    sheet_name = f"P{i+1}_T{j+1}"
                    df.to_excel(writer, sheet_name=sheet_name, index=False)
            
            if not tables_found:
               # Create a dummy sheet if no tables found so file is valid
               df = pd.DataFrame({"Message": ["No tables found in PDF"]})
               df.to_excel(writer, sheet_name="No Tables", index=False)
               print("No tables found in PDF, creating dummy sheet.")

    print(f"Saved {output_xlsx}")

def convert_to_images(pdf_path, output_dir, fmt="jpeg"):
    """Convert PDF pages to images using pdf2image."""
    import concurrent.futures

    print(f"Converting {pdf_path} to images (format: {fmt})...")
    
    # Check if we can use thread_count in convert_from_path (it supports it)
    try:
        # Use available CPUs for conversion
        thread_count = os.cpu_count() or 4
        images = convert_from_path(pdf_path, thread_count=thread_count)
    except Exception as e:
        print(f"Warning: Multithreaded conversion failed, falling back to default. Error: {e}")
        images = convert_from_path(pdf_path)

    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    
    # Map friendly format to PIL format
    pil_format = "JPEG" if fmt.lower() == "jpeg" or fmt.lower() == "jpg" else fmt.upper()
    ext = "jpg" if fmt.lower() == "jpeg" else fmt.lower()

    def save_image(args):
        i, image, output_dir_path = args
        image_path = os.path.join(output_dir_path, f"{base_name}_page_{i+1}.{ext}")
        image.save(image_path, pil_format)
        print(f"Saved {image_path}")
        return image_path

    # Parallelize saving
    with concurrent.futures.ThreadPoolExecutor() as executor:
        # Prepare args
        tasks = [(i, img, output_dir) for i, img in enumerate(images)]
        executor.map(save_image, tasks)

# ... (extract_text and convert_to_word functions omitted for brevity if unchanged)

def main():
    parser = argparse.ArgumentParser(description="Convert PDF tools")
    parser.add_argument("input_pdf", help="Path to input PDF file")
    # Make output optional/positional to handle different usage patterns
    parser.add_argument("output", nargs="?", help="Output file or directory")
    
    parser.add_argument("--to-images", action="store_true", help="Convert pages to images")
    parser.add_argument("--image-format", default="jpeg", choices=["jpeg", "jpg", "png"], help="Image format (jpeg, png)")
    parser.add_argument("--to-text", action="store_true", help="Extract text to .txt file")
    parser.add_argument("--output-dir", default=".", help="Output directory for images")

    args = parser.parse_args()

    # ... (validation checks)

    if args.to_images:
        out_dir = args.output if (args.output and os.path.isdir(args.output)) else args.output_dir
        os.makedirs(out_dir, exist_ok=True)
        convert_to_images(args.input_pdf, out_dir, args.image_format)
        return

    # Handle other conversions based on output extension or flags
    if args.output:
        ext = os.path.splitext(args.output)[1].lower()
        if ext == ".docx":
            convert_to_word(args.input_pdf, args.output)
            return
        elif ext == ".xlsx":
             convert_to_excel(args.input_pdf, args.output)
             return
        elif ext == ".txt":
            extract_text(args.input_pdf, args.output)
            return

    # Fallback/Default behavior if flags are used without explicit output extension logic matching above
    if args.to_text and args.output:
         extract_text(args.input_pdf, args.output)
         return
    
    print("Error: No valid conversion task identified. Please specify an output file with .docx, .xlsx, or .txt extension, or use --to-images.")
    sys.exit(1)

def extract_text(pdf_path, output_txt):
    """Extract text from PDF using pdfplumber."""
    print(f"Extracting text from {pdf_path}...")
    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() or ""
            text += "\n\n"
            
    with open(output_txt, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"Saved text to {output_txt}")

def convert_to_word(pdf_path, output_docx):
    """Convert PDF to Word. parameters: input, output."""
    print(f"Converting {pdf_path} to {output_docx}...")
    # Try using pdf2docx if available
    try:
        from pdf2docx import Converter
        cv = Converter(pdf_path)
        cv.convert(output_docx, start=0, end=None)
        cv.close()
        print(f"Saved {output_docx}")
        return
    except ImportError:
        print("pdf2docx not installed. Falling back to text extraction...")

    # Fallback: Extract text and save as docx using python-docx
    try:
        import docx
        doc = docx.Document()
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    doc.add_paragraph(text)
                    doc.add_page_break()
        doc.save(output_docx)
        print(f"Saved {output_docx} (Text only)")
        return
    except ImportError:
        print("python-docx not installed. Cannot create DOCX.")
        # Last resort: write text to file but name it docx (XML error likely)
        # Better to error out or write a simple RTF?
        # Let's write a simple text file, but user expects docx.
        # We will exit with error if dependencies are missing used in this route
        print("Error: Missing dependencies (pdf2docx or python-docx).")
        sys.exit(1)



if __name__ == "__main__":
    main()
