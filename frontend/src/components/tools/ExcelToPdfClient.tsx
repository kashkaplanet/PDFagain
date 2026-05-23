"use client";

import React, { useState } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { Download, Table } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as XLSX from "xlsx";

export default function ExcelToPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setError(null);
        }
    };

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            "application/vnd.ms-excel": [".xls"],
            "text/csv": [".csv"],
        },
    });

    const handleConvert = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: "array" });

            const pdfDoc = await PDFDocument.create();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            for (const sheetName of workbook.SheetNames) {
                const sheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

                if (data.length === 0) continue;

                const page = pdfDoc.addPage([612, 792]);
                const { width, height } = page.getSize();

                let y = height - 50;
                const margin = 40;
                const cellPadding = 5;
                const fontSize = 9;
                const headerFontSize = 10;

                page.drawText(sheetName, {
                    x: margin,
                    y,
                    size: 14,
                    font: boldFont,
                    color: rgb(0.2, 0.2, 0.2),
                });
                y -= 30;

                const maxCols = Math.min(data.reduce((max, row) => Math.max(max, row?.length || 0), 0), 8);
                const colWidth = (width - margin * 2) / maxCols;

                const maxRows = Math.min(data.length, 50);

                for (let rowIdx = 0; rowIdx < maxRows; rowIdx++) {
                    const row = data[rowIdx] || [];
                    const isHeader = rowIdx === 0;

                    if (y < 60) {
                        const newPage = pdfDoc.addPage([612, 792]);
                        y = height - 50;

                        newPage.drawText(`${sheetName} (continued)`, {
                            x: margin,
                            y,
                            size: 12,
                            font: boldFont,
                            color: rgb(0.3, 0.3, 0.3),
                        });
                        y -= 25;
                    }

                    if (isHeader) {
                        page.drawRectangle({
                            x: margin,
                            y: y - 5,
                            width: width - margin * 2,
                            height: 18,
                            color: rgb(0.9, 0.9, 0.9),
                        });
                    }

                    for (let colIdx = 0; colIdx < maxCols; colIdx++) {
                        const cellValue = String(row[colIdx] ?? "").slice(0, 20);
                        const x = margin + colIdx * colWidth + cellPadding;

                        page.drawText(cellValue, {
                            x,
                            y,
                            size: isHeader ? headerFontSize : fontSize,
                            font: isHeader ? boldFont : font,
                            color: rgb(0.2, 0.2, 0.2),
                            maxWidth: colWidth - cellPadding * 2,
                        });
                    }

                    y -= 16;
                }

                if (data.length > maxRows) {
                    page.drawText(`... and ${data.length - maxRows} more rows`, {
                        x: margin,
                        y: y - 10,
                        size: 9,
                        font,
                        color: rgb(0.5, 0.5, 0.5),
                    });
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = file.name.replace(/\.(xlsx?|xls|csv)$/i, ".pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Conversion failed:", err);
            setError("Failed to convert Excel to PDF. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolPageWrapper
            title="Excel to PDF"
            description="Convert Excel spreadsheets to PDF documents."
            icon={Table}
            color="cyan"
        >
            <RetroCard className="max-w-2xl mx-auto">
                {!file ? (
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        accept={{
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
                            "application/vnd.ms-excel": [".xls"],
                            "text/csv": [".csv"],
                        }}
                        multiple={false}
                        title="Select Excel File"
                        description="Support XLSX, XLS, CSV"
                        variant="cyan"
                    />
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 p-4 bg-[#22D3EE]/10 border-2 border-black">
                            <div className="p-3 bg-[#22D3EE] border-2 border-black">
                                <Table className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-display truncate">
                                    {file.name}
                                </h2>
                                <p className="text-sm text-gray-600 font-sans">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                            >
                                Change
                            </button>
                        </div>

                        {error && (
                            <div className="p-4 bg-[#F87171]/10 border-2 border-[#F87171] text-sm font-sans">
                                {error}
                            </div>
                        )}

                        <RetroActionButton
                            label="Convert to PDF"
                            isProcessing={isProcessing}
                            processingText="Converting..."
                            onClick={handleConvert}
                            color="cyan"
                            icon={<Download className="w-5 h-5" />}
                        />
                    </div>
                )}
            </RetroCard>

            <div className="mt-6 text-center text-sm text-gray-600 font-sans">
                <p>Supports .xlsx, .xls, and .csv files.</p>
                <p>Each sheet becomes a page in the PDF.</p>
            </div>
        </ToolPageWrapper>
    );
}
