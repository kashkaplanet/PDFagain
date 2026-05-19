"""
RTF to PDF converter using striprtf + reportlab.
No Microsoft Word dependency required.
Usage: python convert_rtf.py <input.rtf> <output.pdf>
"""
import sys
import os

def convert_rtf_to_pdf(input_path, output_path):
    input_path = os.path.abspath(input_path)
    output_path = os.path.abspath(output_path)

    if not os.path.exists(input_path):
        print(f"Error: Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    # Read RTF content
    with open(input_path, 'r', encoding='utf-8', errors='replace') as f:
        rtf_content = f.read()

    # Strip RTF formatting to get plain text
    from striprtf.striprtf import rtf_to_text
    try:
        text = rtf_to_text(rtf_content)
    except Exception as e:
        print(f"Error parsing RTF: {e}", file=sys.stderr)
        sys.exit(1)

    if not text or not text.strip():
        print("Warning: No text content extracted from RTF", file=sys.stderr)
        text = "(Empty document)"

    # Generate PDF using reportlab
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import cm
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    styles = getSampleStyleSheet()
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=11,
        leading=16,
        spaceAfter=6,
    )

    story = []
    # Split text into paragraphs and add them
    paragraphs = text.split('\n')
    for para in paragraphs:
        para = para.strip()
        if para:
            # Escape XML special characters for reportlab
            para = para.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            story.append(Paragraph(para, body_style))
        else:
            story.append(Spacer(1, 12))

    if not story:
        story.append(Paragraph("(Empty document)", body_style))

    doc.build(story)
    print(f"Successfully converted {input_path} to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert_rtf.py <input_rtf> <output_pdf>")
        sys.exit(1)

    convert_rtf_to_pdf(sys.argv[1], sys.argv[2])
