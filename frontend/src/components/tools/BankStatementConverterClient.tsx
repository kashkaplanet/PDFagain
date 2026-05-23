"use client";

import React, { useState, useCallback } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { usePDF } from "@/hooks/usePDF";
import {
    Landmark, Download, ArrowRight, AlertCircle,
    FileSpreadsheet, Globe, FileText, Table, CheckCircle2
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────

interface Transaction {
    date: string;
    description: string;
    amount: number;
    type: "credit" | "debit";
    category: string;
}

// ─── CURRENCY DATA ───────────────────────────────────────

interface CurrencyInfo {
    code: string;
    symbol: string;
    name: string;
    locale: string;
}

const CURRENCIES: CurrencyInfo[] = [
    { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
    { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
    { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB" },
    { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen", locale: "ja-JP" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan", locale: "zh-CN" },
    { code: "KRW", symbol: "₩", name: "South Korean Won", locale: "ko-KR" },
    { code: "CAD", symbol: "CA$", name: "Canadian Dollar", locale: "en-CA" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
    { code: "CHF", symbol: "CHF", name: "Swiss Franc", locale: "de-CH" },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar", locale: "en-SG" },
    { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", locale: "en-HK" },
    { code: "MXN", symbol: "MX$", name: "Mexican Peso", locale: "es-MX" },
    { code: "BRL", symbol: "R$", name: "Brazilian Real", locale: "pt-BR" },
    { code: "ZAR", symbol: "R", name: "South African Rand", locale: "en-ZA" },
    { code: "NGN", symbol: "₦", name: "Nigerian Naira", locale: "en-NG" },
    { code: "TRY", symbol: "₺", name: "Turkish Lira", locale: "tr-TR" },
    { code: "RUB", symbol: "₽", name: "Russian Ruble", locale: "ru-RU" },
    { code: "AED", symbol: "د.إ", name: "UAE Dirham", locale: "ar-AE" },
    { code: "SAR", symbol: "﷼", name: "Saudi Riyal", locale: "ar-SA" },
    { code: "PKR", symbol: "₨", name: "Pakistani Rupee", locale: "ur-PK" },
    { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", locale: "bn-BD" },
    { code: "THB", symbol: "฿", name: "Thai Baht", locale: "th-TH" },
    { code: "VND", symbol: "₫", name: "Vietnamese Dong", locale: "vi-VN" },
    { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", locale: "id-ID" },
    { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", locale: "ms-MY" },
    { code: "PHP", symbol: "₱", name: "Philippine Peso", locale: "en-PH" },
];

const CURRENCY_SYMBOLS = [...new Set(CURRENCIES.map(c => c.symbol))].sort((a, b) => b.length - a.length);
const CURRENCY_SYMBOL_REGEX_PART = CURRENCY_SYMBOLS.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");

function getCurrencyInfo(code: string): CurrencyInfo {
    return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
}

function detectCurrency(text: string): string {
    const sample = text.slice(0, 5000).toLowerCase();
    const symbolChecks: [string, string][] = [
        ["₹", "INR"], ["€", "EUR"], ["£", "GBP"], ["₩", "KRW"],
        ["₺", "TRY"], ["₽", "RUB"], ["₦", "NGN"], ["₱", "PHP"],
        ["₫", "VND"], ["৳", "BDT"], ["฿", "THB"], ["r$", "BRL"],
        ["rm", "MYR"], ["rp", "IDR"],
    ];
    for (const [sym, code] of symbolChecks) {
        if (sample.includes(sym)) return code;
    }
    const codeChecks = ["INR", "EUR", "GBP", "JPY", "CNY", "KRW", "CAD", "AUD",
        "CHF", "SGD", "HKD", "BRL", "MXN", "ZAR", "TRY", "AED", "SAR", "PKR",
        "BDT", "THB", "VND", "IDR", "MYR", "PHP", "NGN"];
    for (const code of codeChecks) {
        if (new RegExp(`\\b${code}\\b`, "i").test(sample)) return code;
    }
    if (sample.includes("$")) return "USD";
    return "USD";
}

// ─── CATEGORY ENGINE ─────────────────────────────────────

const CATEGORY_RULES: { category: string; keywords: string[] }[] = [
    { category: "Salary / Income", keywords: ["salary", "payroll", "wages", "direct deposit", "income", "bonus", "commission", "pay", "stipend"] },
    { category: "Transfers", keywords: ["transfer", "xfer", "wire", "zelle", "venmo", "paypal", "cashapp", "ach", "internal"] },
    { category: "Food & Dining", keywords: ["restaurant", "cafe", "coffee", "mcdonald", "starbucks", "burger", "pizza", "subway", "doordash", "food", "bakery"] },
    { category: "Shopping", keywords: ["amazon", "walmart", "target", "ebay", "shop", "store", "mall", "bestbuy", "costco", "retail", "purchase"] },
    { category: "Utilities", keywords: ["electric", "gas bill", "water bill", "utility", "power", "internet", "wifi", "comcast", "verizon", "phone bill"] },
    { category: "Rent / Housing", keywords: ["rent", "mortgage", "lease", "property", "hoa", "housing", "apartment", "landlord"] },
    { category: "Transportation", keywords: ["uber", "lyft", "gas station", "fuel", "parking", "transit", "metro", "bus", "toll", "taxi"] },
    { category: "Entertainment", keywords: ["netflix", "spotify", "cinema", "theater", "gaming", "hulu", "disney", "hbo", "movie", "concert"] },
    { category: "Healthcare", keywords: ["pharmacy", "hospital", "doctor", "medical", "dental", "health", "cvs", "walgreens", "clinic"] },
    { category: "ATM / Cash", keywords: ["atm", "cash withdrawal", "cashback", "cash back", "withdraw"] },
    { category: "Insurance", keywords: ["insurance", "geico", "allstate", "progressive", "premium", "policy", "coverage"] },
    { category: "Miscellaneous", keywords: [] },
];

function categorizeTransaction(description: string): string {
    const lower = description.toLowerCase();
    for (const rule of CATEGORY_RULES) {
        if (rule.keywords.length === 0) continue;
        for (const keyword of rule.keywords) {
            if (lower.includes(keyword)) return rule.category;
        }
    }
    return "Miscellaneous";
}

// ─── DATE PARSING ────────────────────────────────────────

const DATE_PATTERNS = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
    /(\d{1,2})[\/\-](Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\/\-](\d{2,4})/i,
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s*(\d{4})/i,
];

function extractDate(text: string): string | null {
    for (const pattern of DATE_PATTERNS) {
        const match = text.match(pattern);
        if (match) return match[0];
    }
    return null;
}

// ─── AMOUNT PARSING ──────────────────────────────────────

function extractAmount(text: string): { amount: number; type: "credit" | "debit" } | null {
    const patterns = [
        new RegExp(`(-?\\s*)(?:${CURRENCY_SYMBOL_REGEX_PART})\\s*([\\d,]+\\.?\\d{0,2})`),
        /([\d,]+\.?\d{0,2})\s*(CR|DR|Cr|Dr|cr|dr)\b/,
        /([\d,]+\.\d{2})\b/,
        /([\d,]+\.\d{2})\s*$/,
    ];

    for (let pi = 0; pi < patterns.length; pi++) {
        const match = text.match(patterns[pi]);
        if (match) {
            if (pi === 0) {
                const sign = match[1].includes("-") ? -1 : 1;
                const val = parseFloat(match[2].replace(/,/g, ""));
                if (!isNaN(val) && val > 0) return { amount: val, type: sign < 0 ? "debit" : "credit" };
            } else if (pi === 1) {
                const val = parseFloat(match[1].replace(/,/g, ""));
                const typeStr = match[2].toUpperCase();
                if (!isNaN(val) && val > 0) return { amount: val, type: typeStr === "CR" ? "credit" : "debit" };
            } else {
                const val = parseFloat(match[1].replace(/,/g, ""));
                if (!isNaN(val) && val > 0.01) return { amount: val, type: "debit" };
            }
        }
    }
    return null;
}

const CREDIT_KEYWORDS = ["deposit", "credit", "salary", "refund", "cashback", "interest earned", "dividend", "income", "reimbursement", "payment received", "cr"];
const DEBIT_KEYWORDS = ["withdrawal", "debit", "purchase", "payment", "charge", "fee", "dr"];

function refineType(desc: string, current: "credit" | "debit"): "credit" | "debit" {
    const lower = desc.toLowerCase();
    for (const kw of CREDIT_KEYWORDS) { if (lower.includes(kw)) return "credit"; }
    for (const kw of DEBIT_KEYWORDS) { if (lower.includes(kw)) return "debit"; }
    return current;
}

// ─── CSV PARSER ──────────────────────────────────────────

function parseCSVContent(text: string): Transaction[] {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) return [];

    const headerLine = lines[0].toLowerCase();
    const separator = headerLine.includes("\t") ? "\t" : ",";

    const parseRow = (line: string): string[] => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;
        for (const char of line) {
            if (char === '"') { inQuotes = !inQuotes; }
            else if (char === separator.charAt(0) && !inQuotes) { result.push(current.trim()); current = ""; }
            else { current += char; }
        }
        result.push(current.trim());
        return result;
    };

    const headers = parseRow(lines[0]).map(h => h.toLowerCase().replace(/['"]/g, ""));
    const dateCol = headers.findIndex(h => /date|posted|trans.*date|booking/i.test(h));
    const descCol = headers.findIndex(h => /desc|narration|detail|particular|memo|reference|merchant|payee/i.test(h));
    const amountCol = headers.findIndex(h => /^amount$|^value$|^sum$/i.test(h));
    const debitCol = headers.findIndex(h => /debit|withdrawal|dr/i.test(h));
    const creditCol = headers.findIndex(h => /credit|deposit|cr/i.test(h));

    const transactions: Transaction[] = [];

    for (let i = 1; i < lines.length; i++) {
        const cols = parseRow(lines[i]);
        if (cols.length < 2) continue;

        let date = dateCol >= 0 ? cols[dateCol] : "";
        let description = descCol >= 0 ? cols[descCol] : "";
        let amount = 0;
        let type: "credit" | "debit" = "debit";

        if (!description && cols.length > 1) description = cols[1];
        if (!date && cols.length > 0) date = cols[0];

        if (debitCol >= 0 && creditCol >= 0) {
            const debitVal = parseFloat((cols[debitCol] || "0").replace(/[^\d.\-]/g, ""));
            const creditVal = parseFloat((cols[creditCol] || "0").replace(/[^\d.\-]/g, ""));
            if (!isNaN(creditVal) && creditVal > 0) { amount = creditVal; type = "credit"; }
            else if (!isNaN(debitVal) && debitVal > 0) { amount = debitVal; type = "debit"; }
        } else if (amountCol >= 0) {
            const val = parseFloat((cols[amountCol] || "0").replace(/[^\d.\-]/g, ""));
            if (!isNaN(val)) { amount = Math.abs(val); type = val < 0 ? "debit" : "credit"; }
        }

        if (!date || amount === 0 || !description) continue;
        if (!extractDate(date) && !/\d/.test(date)) continue;

        type = refineType(description, type);
        const category = categorizeTransaction(description);

        transactions.push({
            date: date.replace(/['"]/g, ""),
            description: description.replace(/['"]/g, ""),
            amount, type, category,
        });
    }
    return transactions;
}

// ─── EXCEL PARSER ────────────────────────────────────────

async function parseExcelFile(file: File): Promise<Transaction[]> {
    const XLSX = await import("xlsx");
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const csvText = XLSX.utils.sheet_to_csv(firstSheet);
    return parseCSVContent(csvText);
}

// ─── PDF TEXT PARSER ─────────────────────────────────────

function parseTransactionsFromText(text: string): Transaction[] {
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 5);
    const transactions: Transaction[] = [];

    for (const line of lines) {
        const date = extractDate(line);
        if (!date) continue;

        const amountInfo = extractAmount(line);
        if (!amountInfo) continue;

        let description = line;
        description = description.replace(date, "").trim();
        const amountPatterns = [
            new RegExp(`(-?\\s*)(?:${CURRENCY_SYMBOL_REGEX_PART})\\s*([\\d,]+\\.?\\d{0,2})`, "g"),
            /([\d,]+\.?\d{0,2})\s*(CR|DR|Cr|Dr|cr|dr)\b/g,
            /([\d,]+\.\d{2})\s*$/g,
        ];
        for (const p of amountPatterns) description = description.replace(p, "").trim();
        description = description.replace(/\s+/g, " ").trim();

        if (description.length < 2) continue;

        const type = refineType(description, amountInfo.type);
        const category = categorizeTransaction(description);

        transactions.push({
            date, description,
            amount: amountInfo.amount,
            type, category,
        });
    }
    return transactions;
}

// ─── COMPONENT ───────────────────────────────────────────

type OutputFormat = "csv" | "xlsx";

export default function BankStatementConverterClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isPdf, setIsPdf] = useState(false);
    const { pdfProxy, pageCount, loading } = usePDF(isPdf ? file : null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [parsed, setParsed] = useState(false);
    const [progress, setProgress] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [currency, setCurrency] = useState("USD");
    const [outputFormat, setOutputFormat] = useState<OutputFormat>("csv");
    const [converted, setConverted] = useState(false);

    const handleFileSelected = useCallback((files: File[]) => {
        if (files.length > 0) {
            const f = files[0];
            setFile(f);
            setTransactions([]);
            setParsed(false);
            setConverted(false);
            setError(null);
            setIsPdf(f.name.toLowerCase().endsWith(".pdf"));
        }
    }, []);

    useGlobalFileDrop({
        onFilesSelected: handleFileSelected,
        accept: {
            "application/pdf": [".pdf"],
            "text/csv": [".csv"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            "application/vnd.ms-excel": [".xls"],
        },
    });

    const handleReset = () => {
        setFile(null);
        setIsPdf(false);
        setTransactions([]);
        setParsed(false);
        setConverted(false);
        setError(null);
        setProgress("");
    };

    // ─── PDF TEXT EXTRACTION ─────────────────────────────

    const extractPdfText = async (): Promise<string> => {
        if (!pdfProxy) return "";
        let fullText = "";
        for (let i = 1; i <= pageCount; i++) {
            setProgress(`Extracting text: Page ${i} of ${pageCount}...`);
            const page = await pdfProxy.getPage(i);
            const textContent = await page.getTextContent();
            const items = textContent.items as any[];
            const rows: { y: number; items: any[] }[] = [];

            items.forEach((item) => {
                if (!item.str.trim()) return;
                const y = item.transform[5];
                let row = rows.find(r => Math.abs(r.y - y) < 5);
                if (!row) { row = { y, items: [] }; rows.push(row); }
                row.items.push(item);
            });

            rows.sort((a, b) => b.y - a.y);

            const pageText = rows.map(row => {
                row.items.sort((a, b) => a.transform[4] - b.transform[4]);
                let rowText = "";
                let lastX = -1;
                let lastWidth = 0;
                row.items.forEach(item => {
                    const x = item.transform[4];
                    const text = item.str;
                    let width = item.width;
                    if (!width || width === 0) width = text.length * (item.transform[0] * 0.4);
                    if (lastX >= 0) {
                        const gap = x - (lastX + lastWidth);
                        if (gap > Math.max(2, item.transform[0] * 0.2) && item.str.trim().length > 0) {
                            rowText += "    ";
                        }
                    }
                    rowText += text;
                    lastX = x;
                    lastWidth = width;
                });
                return rowText;
            }).join("\n");

            fullText += pageText + "\n";
        }
        return fullText;
    };

    // ─── PARSE HANDLER ───────────────────────────────────

    const handleParse = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress("");
        setError(null);

        try {
            let txns: Transaction[] = [];
            const ext = file.name.toLowerCase().split(".").pop() || "";

            if (ext === "csv") {
                setProgress("Parsing CSV file...");
                const text = await file.text();
                const detected = detectCurrency(text);
                setCurrency(detected);
                txns = parseCSVContent(text);
            } else if (ext === "xlsx" || ext === "xls") {
                setProgress("Parsing Excel file...");
                txns = await parseExcelFile(file);
            } else if (ext === "pdf") {
                if (!pdfProxy) {
                    setError("PDF is still loading. Please wait and try again.");
                    return;
                }
                const text = await extractPdfText();
                if (!text.trim()) {
                    setError("No text extracted from PDF. The file may be image-based.");
                    return;
                }
                setProgress("Detecting currency & parsing transactions...");
                const detected = detectCurrency(text);
                setCurrency(detected);
                txns = parseTransactionsFromText(text);
            } else {
                setError(`Unsupported format: .${ext}. Upload PDF, CSV, or Excel.`);
                return;
            }

            if (txns.length === 0) {
                setError("No transactions detected. The file format may not be recognized. Try a CSV or Excel export from your bank.");
                return;
            }

            setTransactions(txns);
            setParsed(true);
        } catch (err: any) {
            console.error("Parse failed:", err);
            setError(err.message || "Failed to parse file.");
        } finally {
            setIsProcessing(false);
            setProgress("");
        }
    };

    // ─── EXPORT HANDLERS ─────────────────────────────────

    const handleDownloadCSV = () => {
        // const ci = getCurrencyInfo(currency);
        let csv = "Date,Description,Amount,Type,Category\n";
        transactions.forEach(t => {
            csv += `${t.date},"${t.description}",${t.type === "debit" ? "-" : ""}${t.amount.toFixed(2)},${t.type},${t.category}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${file?.name.replace(/\.[^.]+$/, "")}_converted.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setConverted(true);
    };

    const handleDownloadExcel = async () => {
        const XLSX = await import("xlsx");
        // const ci = getCurrencyInfo(currency);

        const data = transactions.map(t => ({
            Date: t.date,
            Description: t.description,
            Amount: t.type === "debit" ? -t.amount : t.amount,
            Type: t.type.charAt(0).toUpperCase() + t.type.slice(1),
            Category: t.category,
            Currency: ci.code,
        }));

        const ws = XLSX.utils.json_to_sheet(data);

        // Set column widths
        ws["!cols"] = [
            { wch: 14 }, // Date
            { wch: 40 }, // Description
            { wch: 14 }, // Amount
            { wch: 10 }, // Type
            { wch: 20 }, // Category
            { wch: 8 },  // Currency
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transactions");

        // Summary sheet
        const totalCredits = transactions.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
        const totalDebits = transactions.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);
        const summaryData = [
            { Field: "Total Transactions", Value: transactions.length },
            { Field: "Total Credits", Value: totalCredits.toFixed(2) },
            { Field: "Total Debits", Value: totalDebits.toFixed(2) },
            { Field: "Net Change", Value: (totalCredits - totalDebits).toFixed(2) },
            { Field: "Currency", Value: ci.code },
        ];
        const ws2 = XLSX.utils.json_to_sheet(summaryData);
        ws2["!cols"] = [{ wch: 20 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, ws2, "Summary");

        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${file?.name.replace(/\.[^.]+$/, "")}_converted.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setConverted(true);
    };

    const handleConvert = () => {
        if (outputFormat === "csv") handleDownloadCSV();
        else handleDownloadExcel();
    };

    const totalCredits = transactions.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
    const totalDebits = transactions.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);
    const ci = getCurrencyInfo(currency);

    // ─── RENDER ──────────────────────────────────────────

    return (
        <ToolPageWrapper
            title="Bank Statement Converter"
            description="Convert bank statements between PDF, CSV, and Excel formats."
            icon={Landmark}
            color="blue"
        >
            {/* ─── STEP 1: UPLOAD ─── */}
            {!file ? (
                <RetroCard className="max-w-2xl mx-auto">
                    <div className="mb-4 p-3 bg-[#60A5FA]/15 border-2 border-black text-sm font-sans">
                        <strong className="font-display">Supported inputs:</strong> PDF, CSV, Excel (.xlsx / .xls)
                        <br />
                        <strong className="font-display">Output formats:</strong> CSV, Excel (.xlsx)
                        <br />
                        <span className="text-gray-500">All processing happens locally in your browser. No data leaves your device.</span>
                    </div>
                    <RetroFileUploader
                        onFilesSelected={handleFileSelected}
                        multiple={false}
                        title="Upload Bank Statement"
                        description="Drag & drop or click to browse"
                        variant="green"
                    />
                </RetroCard>

                /* ─── STEP 2: CONFIGURE & PARSE ─── */
            ) : !parsed ? (
                <RetroCard className="max-w-xl mx-auto">
                    {/* File Info */}
                    <div className="flex items-center space-x-4 mb-6 p-4 bg-[#60A5FA]/10 border-2 border-black">
                        <div className="p-3 bg-[#60A5FA] border-2 border-black">
                            {isPdf ? <Landmark className="w-6 h-6" /> : <FileSpreadsheet className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-display truncate">{file.name}</h2>
                            <p className="text-sm text-gray-600 font-sans">
                                {isPdf ? `${pageCount} pages • ` : ""}{(file.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 border-2 border-black bg-white hover:bg-[#60A5FA] font-display text-sm transition-colors"
                        >
                            Change
                        </button>
                    </div>

                    {/* Currency Selector */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 mb-2 text-sm font-display">
                            <Globe className="w-4 h-4" /> Currency
                        </label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-black font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                        >
                            {CURRENCIES.map((c) => (
                                <option key={c.code} value={c.code}>
                                    {c.symbol} {c.code} — {c.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-400 font-sans mt-1">Auto-detected after parsing, or choose manually</p>
                    </div>

                    <RetroActionButton
                        label="Parse Statement"
                        isProcessing={isProcessing}
                        processingText={progress || "Processing..."}
                        onClick={handleParse}
                        disabled={isPdf && loading}
                        color="blue"
                        icon={<ArrowRight className="w-5 h-5" />}
                    />

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border-2 border-red-500 text-red-700 font-sans flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </RetroCard>

                /* ─── STEP 3: PREVIEW & CONVERT ─── */
            ) : (
                <div className="space-y-6">
                    {/* Summary Header */}
                    <RetroCard>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#60A5FA] border-2 border-black">
                                    <Landmark className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-display">{transactions.length} Transactions Found</h2>
                                    <p className="text-sm text-gray-600 font-sans">
                                        Credits: {ci.symbol}{totalCredits.toLocaleString(ci.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} • Debits: {ci.symbol}{totalDebits.toLocaleString(ci.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 border-2 border-black bg-white hover:bg-[#60A5FA] font-display text-sm transition-colors"
                            >
                                New File
                            </button>
                        </div>
                    </RetroCard>

                    {/* Transaction Preview */}
                    <RetroCard>
                        <h3 className="text-lg font-display mb-4 flex items-center gap-2">
                            <Table className="w-5 h-5" /> Transaction Preview
                        </h3>
                        <div className="overflow-x-auto max-h-[400px] overflow-y-auto border-2 border-black">
                            <table className="w-full text-sm font-sans">
                                <thead className="bg-gray-100 sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2 text-left border-b-2 border-black font-display">#</th>
                                        <th className="px-3 py-2 text-left border-b-2 border-black font-display">Date</th>
                                        <th className="px-3 py-2 text-left border-b-2 border-black font-display">Description</th>
                                        <th className="px-3 py-2 text-right border-b-2 border-black font-display">Amount</th>
                                        <th className="px-3 py-2 text-left border-b-2 border-black font-display">Type</th>
                                        <th className="px-3 py-2 text-left border-b-2 border-black font-display">Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.slice(0, 50).map((t, i) => (
                                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                            <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{t.date}</td>
                                            <td className="px-3 py-2 max-w-[250px] truncate">{t.description}</td>
                                            <td className={`px-3 py-2 text-right whitespace-nowrap font-mono ${t.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                                                {t.type === "debit" ? "-" : "+"}{ci.symbol}{t.amount.toLocaleString(ci.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-3 py-2">
                                                <span className={`inline-block px-2 py-0.5 text-xs font-display border border-black ${t.type === "credit" ? "bg-green-100" : "bg-red-100"}`}>
                                                    {t.type}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-gray-600">{t.category}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {transactions.length > 50 && (
                            <p className="text-xs text-gray-400 font-sans mt-2 text-center">
                                Showing 50 of {transactions.length} transactions. All will be included in the export.
                            </p>
                        )}
                    </RetroCard>

                    {/* Export Options */}
                    <RetroCard>
                        <h3 className="text-lg font-display mb-4 flex items-center gap-2">
                            <Download className="w-5 h-5" /> Export Options
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            <button
                                onClick={() => setOutputFormat("csv")}
                                className={`p-4 border-2 border-black text-left transition-all ${outputFormat === "csv"
                                    ? "bg-[#FACC15]/20 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                                    : "bg-white hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6" />
                                    <div>
                                        <div className="font-display text-sm">CSV File</div>
                                        <div className="text-xs text-gray-500 font-sans">Comma-separated values, universal format</div>
                                    </div>
                                </div>
                            </button>
                            <button
                                onClick={() => setOutputFormat("xlsx")}
                                className={`p-4 border-2 border-black text-left transition-all ${outputFormat === "xlsx"
                                    ? "bg-[#FACC15]/20 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                                    : "bg-white hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <FileSpreadsheet className="w-6 h-6" />
                                    <div>
                                        <div className="font-display text-sm">Excel (.xlsx)</div>
                                        <div className="text-xs text-gray-500 font-sans">With summary sheet & column formatting</div>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <RetroActionButton
                                label={converted ? "Downloaded!" : `Convert to ${outputFormat.toUpperCase()}`}
                                isProcessing={false}
                                processingText=""
                                onClick={handleConvert}
                                color="yellow"
                                icon={converted ? <CheckCircle2 className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                            />
                            {converted && (
                                <RetroActionButton
                                    label="Download Again"
                                    isProcessing={false}
                                    processingText=""
                                    onClick={() => { setConverted(false); handleConvert(); }}
                                    color="default"
                                    icon={<Download className="w-5 h-5" />}
                                />
                            )}
                        </div>
                    </RetroCard>
                </div>
            )}
        </ToolPageWrapper>
    );
}
