"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useGlobalFileDrop } from "@/hooks/useGlobalFileDrop";
import { RetroFileUploader } from "@/components/RetroFileUploader";
import { RetroCard, RetroActionButton } from "@/components/RetroCard";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { usePDF } from "@/hooks/usePDF";
import {
    Landmark, Copy, Download, CheckCircle2,
    TrendingUp, TrendingDown, ArrowUpDown,
    Wallet, Banknote, BarChart3, FileSpreadsheet,
    PiggyBank, AlertCircle, ArrowUp, ArrowDown,
    Calendar, Search, SortAsc, SortDesc, Globe
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────

interface Transaction {
    date: string;
    description: string;
    amount: number;
    type: "credit" | "debit";
    category: string;
    rawLine?: string;
}

interface CategoryBreakdown {
    category: string;
    totalAmount: number;
    count: number;
    percentage: number;
    color: string;
}

interface AnalysisResult {
    transactions: Transaction[];
    totalCredits: number;
    totalDebits: number;
    netChange: number;
    avgTransaction: number;
    categories: CategoryBreakdown[];
    largestDebit: Transaction | null;
    largestCredit: Transaction | null;
    dateRange: { from: string; to: string } | null;
    sourceFormat: string;
    currencyCode: string;
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
    { code: "SEK", symbol: "kr", name: "Swedish Krona", locale: "sv-SE" },
    { code: "NOK", symbol: "kr", name: "Norwegian Krone", locale: "nb-NO" },
    { code: "DKK", symbol: "kr", name: "Danish Krone", locale: "da-DK" },
    { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", locale: "en-NZ" },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar", locale: "en-SG" },
    { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", locale: "en-HK" },
    { code: "TWD", symbol: "NT$", name: "Taiwan Dollar", locale: "zh-TW" },
    { code: "MXN", symbol: "MX$", name: "Mexican Peso", locale: "es-MX" },
    { code: "BRL", symbol: "R$", name: "Brazilian Real", locale: "pt-BR" },
    { code: "ARS", symbol: "AR$", name: "Argentine Peso", locale: "es-AR" },
    { code: "CLP", symbol: "CL$", name: "Chilean Peso", locale: "es-CL" },
    { code: "COP", symbol: "COL$", name: "Colombian Peso", locale: "es-CO" },
    { code: "PEN", symbol: "S/.", name: "Peruvian Sol", locale: "es-PE" },
    { code: "ZAR", symbol: "R", name: "South African Rand", locale: "en-ZA" },
    { code: "NGN", symbol: "₦", name: "Nigerian Naira", locale: "en-NG" },
    { code: "EGP", symbol: "E£", name: "Egyptian Pound", locale: "ar-EG" },
    { code: "KES", symbol: "KSh", name: "Kenyan Shilling", locale: "en-KE" },
    { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi", locale: "en-GH" },
    { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling", locale: "sw-TZ" },
    { code: "MAD", symbol: "MAD", name: "Moroccan Dirham", locale: "ar-MA" },
    { code: "TRY", symbol: "₺", name: "Turkish Lira", locale: "tr-TR" },
    { code: "RUB", symbol: "₽", name: "Russian Ruble", locale: "ru-RU" },
    { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia", locale: "uk-UA" },
    { code: "PLN", symbol: "zł", name: "Polish Zloty", locale: "pl-PL" },
    { code: "CZK", symbol: "Kč", name: "Czech Koruna", locale: "cs-CZ" },
    { code: "HUF", symbol: "Ft", name: "Hungarian Forint", locale: "hu-HU" },
    { code: "RON", symbol: "lei", name: "Romanian Leu", locale: "ro-RO" },
    { code: "BGN", symbol: "лв", name: "Bulgarian Lev", locale: "bg-BG" },
    { code: "HRK", symbol: "kn", name: "Croatian Kuna", locale: "hr-HR" },
    { code: "RSD", symbol: "din", name: "Serbian Dinar", locale: "sr-RS" },
    { code: "AED", symbol: "د.إ", name: "UAE Dirham", locale: "ar-AE" },
    { code: "SAR", symbol: "﷼", name: "Saudi Riyal", locale: "ar-SA" },
    { code: "QAR", symbol: "QR", name: "Qatari Riyal", locale: "ar-QA" },
    { code: "KWD", symbol: "KD", name: "Kuwaiti Dinar", locale: "ar-KW" },
    { code: "BHD", symbol: "BD", name: "Bahraini Dinar", locale: "ar-BH" },
    { code: "OMR", symbol: "OMR", name: "Omani Rial", locale: "ar-OM" },
    { code: "ILS", symbol: "₪", name: "Israeli Shekel", locale: "he-IL" },
    { code: "PKR", symbol: "₨", name: "Pakistani Rupee", locale: "ur-PK" },
    { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", locale: "bn-BD" },
    { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee", locale: "si-LK" },
    { code: "NPR", symbol: "रू", name: "Nepalese Rupee", locale: "ne-NP" },
    { code: "MMK", symbol: "K", name: "Myanmar Kyat", locale: "my-MM" },
    { code: "THB", symbol: "฿", name: "Thai Baht", locale: "th-TH" },
    { code: "VND", symbol: "₫", name: "Vietnamese Dong", locale: "vi-VN" },
    { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", locale: "id-ID" },
    { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", locale: "ms-MY" },
    { code: "PHP", symbol: "₱", name: "Philippine Peso", locale: "en-PH" },
    { code: "BTC", symbol: "₿", name: "Bitcoin", locale: "en-US" },
];

// All unique currency symbols for regex matching
const CURRENCY_SYMBOLS = [...new Set(CURRENCIES.map(c => c.symbol))].sort((a, b) => b.length - a.length);
const CURRENCY_SYMBOL_REGEX_PART = CURRENCY_SYMBOLS.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");

function getCurrencyInfo(code: string): CurrencyInfo {
    return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
}

/** Auto-detect currency from text content by scanning for symbols and codes */
function detectCurrency(text: string): string {
    const sample = text.slice(0, 5000).toLowerCase();
    // Check for unique symbols first (most reliable)
    const symbolChecks: [string, string][] = [
        ["₹", "INR"], ["€", "EUR"], ["£", "GBP"], ["₩", "KRW"],
        ["₺", "TRY"], ["₽", "RUB"], ["₴", "UAH"], ["₦", "NGN"],
        ["₪", "ILS"], ["₱", "PHP"], ["₫", "VND"], ["৳", "BDT"],
        ["฿", "THB"], ["zł", "PLN"], ["kč", "CZK"], ["r$", "BRL"],
        ["rm", "MYR"], ["rp", "IDR"],
    ];
    for (const [sym, code] of symbolChecks) {
        if (sample.includes(sym)) return code;
    }
    // Check for currency codes mentioned explicitly
    const codeChecks = ["INR", "EUR", "GBP", "JPY", "CNY", "KRW", "CAD", "AUD",
        "CHF", "SGD", "HKD", "BRL", "MXN", "ZAR", "TRY", "AED", "SAR", "PKR",
        "BDT", "THB", "VND", "IDR", "MYR", "PHP", "NGN", "EGP", "KES"];
    for (const code of codeChecks) {
        if (new RegExp(`\\b${code}\\b`, "i").test(sample)) return code;
    }
    // Default fallback
    if (sample.includes("$")) return "USD";
    return "USD";
}

// ─── CATEGORY ENGINE ─────────────────────────────────────

const CATEGORY_RULES: { category: string; keywords: string[]; color: string }[] = [
    { category: "Salary / Income", keywords: ["salary", "payroll", "wages", "direct deposit", "income", "bonus", "commission", "pay", "stipend"], color: "#34D399" },
    { category: "Transfers", keywords: ["transfer", "xfer", "wire", "zelle", "venmo", "paypal", "cashapp", "ach", "internal"], color: "#60A5FA" },
    { category: "Food & Dining", keywords: ["restaurant", "cafe", "coffee", "mcdonald", "starbucks", "burger", "pizza", "subway", "chipotle", "doordash", "uber eats", "grubhub", "dine", "food", "bakery", "dunkin", "kfc", "taco"], color: "#FB923C" },
    { category: "Shopping", keywords: ["amazon", "walmart", "target", "ebay", "shop", "store", "mall", "bestbuy", "costco", "ikea", "home depot", "lowes", "retail", "purchase", "order"], color: "#F472B6" },
    { category: "Utilities", keywords: ["electric", "gas bill", "water bill", "utility", "power", "sewage", "internet", "wifi", "broadband", "comcast", "verizon", "at&t", "t-mobile", "phone bill", "cable"], color: "#FACC15" },
    { category: "Rent / Housing", keywords: ["rent", "mortgage", "lease", "property", "hoa", "housing", "apartment", "landlord", "real estate"], color: "#A78BFA" },
    { category: "Transportation", keywords: ["uber", "lyft", "gas station", "fuel", "shell", "chevron", "bp", "exxon", "parking", "transit", "metro", "bus", "toll", "taxi", "car wash", "auto"], color: "#22D3EE" },
    { category: "Entertainment", keywords: ["netflix", "spotify", "cinema", "theater", "gaming", "hulu", "disney", "hbo", "apple tv", "youtube", "twitch", "movie", "concert", "ticket", "amusement"], color: "#F87171" },
    { category: "Healthcare", keywords: ["pharmacy", "hospital", "doctor", "medical", "dental", "health", "cvs", "walgreens", "clinic", "lab", "vision", "optom", "prescription"], color: "#34D399" },
    { category: "Education", keywords: ["school", "university", "tuition", "course", "udemy", "coursera", "college", "book", "textbook", "student", "academic"], color: "#818CF8" },
    { category: "Subscriptions", keywords: ["subscription", "membership", "monthly", "annual fee", "recurring", "premium", "plan", "saas"], color: "#C084FC" },
    { category: "ATM / Cash", keywords: ["atm", "cash withdrawal", "cashback", "cash back", "cash advance", "withdraw"], color: "#9CA3AF" },
    { category: "Insurance", keywords: ["insurance", "geico", "allstate", "progressive", "premium", "policy", "coverage", "state farm"], color: "#6EE7B7" },
    { category: "Investments", keywords: ["invest", "stock", "mutual fund", "dividend", "brokerage", "fidelity", "vanguard", "schwab", "robinhood", "etrade", "trading"], color: "#FCD34D" },
    { category: "Government / Tax", keywords: ["tax", "irs", "government", "dmv", "fee", "fine", "penalty", "court", "permit", "license", "state of"], color: "#FDA4AF" },
    { category: "Miscellaneous", keywords: [], color: "#D1D5DB" },
];

function categorizeTransaction(description: string): string {
    const lower = description.toLowerCase();
    for (const rule of CATEGORY_RULES) {
        if (rule.keywords.length === 0) continue;
        for (const keyword of rule.keywords) {
            if (lower.includes(keyword)) {
                return rule.category;
            }
        }
    }
    return "Miscellaneous";
}

function getCategoryColor(category: string): string {
    return CATEGORY_RULES.find(r => r.category === category)?.color || "#D1D5DB";
}

// ─── DATE PARSING ────────────────────────────────────────

const DATE_PATTERNS = [
    // MM/DD/YYYY or MM-DD-YYYY
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
    // YYYY-MM-DD or YYYY/MM/DD
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
    // DD/MM/YYYY (handled after trying MM/DD first)
    // DD-Mon-YYYY  e.g. 15-Jan-2024
    /(\d{1,2})[\/\-](Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\/\-](\d{2,4})/i,
    // Mon DD, YYYY  e.g. Jan 15, 2024
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
    // Try multiple patterns — supports ALL currency symbols
    const patterns = [
        // CurrencySymbol 1,234.56 or -CurrencySymbol 1,234.56  (e.g. $1,234.56  ₹1,234.56  €1,234.56)
        new RegExp(`(-?\\s*)(?:${CURRENCY_SYMBOL_REGEX_PART})\\s*([\\d,]+\\.?\\d{0,2})`),
        // 1,234.56 CR or 1,234.56 DR
        /([\d,]+\.?\d{0,2})\s*(CR|DR|Cr|Dr|cr|dr)\b/,
        // Indian lakhs format: 1,23,456.78
        /([\d,]+\.\d{2})\b/,
        // Standalone number at end of line — could be amount
        /([\d,]+\.\d{2})\s*$/,
    ];

    for (let pi = 0; pi < patterns.length; pi++) {
        const match = text.match(patterns[pi]);
        if (match) {
            // Pattern 0: CurrencySymbol + amount
            if (pi === 0) {
                const sign = match[1].includes("-") ? -1 : 1;
                const val = parseFloat(match[2].replace(/,/g, ""));
                if (!isNaN(val) && val > 0) {
                    return { amount: val, type: sign < 0 ? "debit" : "credit" };
                }
            }
            // Pattern 1: amount CR/DR
            else if (pi === 1) {
                const val = parseFloat(match[1].replace(/,/g, ""));
                const typeStr = match[2].toUpperCase();
                if (!isNaN(val) && val > 0) {
                    return { amount: val, type: typeStr === "CR" ? "credit" : "debit" };
                }
            }
            // Pattern 2 & 3: trailing number
            else {
                const val = parseFloat(match[1].replace(/,/g, ""));
                if (!isNaN(val) && val > 0.01) {
                    return { amount: val, type: "debit" }; // default to debit
                }
            }
        }
    }
    return null;
}

// Heuristic: detect credit by description keywords
const CREDIT_KEYWORDS = ["deposit", "credit", "salary", "refund", "cashback", "interest earned", "dividend", "income", "reimbursement", "payment received", "cr"];
const DEBIT_KEYWORDS = ["withdrawal", "debit", "purchase", "payment", "charge", "fee", "dr"];

function refineType(desc: string, current: "credit" | "debit"): "credit" | "debit" {
    const lower = desc.toLowerCase();
    for (const kw of CREDIT_KEYWORDS) {
        if (lower.includes(kw)) return "credit";
    }
    for (const kw of DEBIT_KEYWORDS) {
        if (lower.includes(kw)) return "debit";
    }
    return current;
}

// ─── CSV / EXCEL PARSER ──────────────────────────────────

function parseCSVContent(text: string): Transaction[] {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) return [];

    // Detect header row
    const headerLine = lines[0].toLowerCase();
    const separator = headerLine.includes("\t") ? "\t" : ",";

    const parseRow = (line: string): string[] => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;
        for (const char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === separator.charAt(0) && !inQuotes) {
                result.push(current.trim());
                current = "";
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    };

    const headers = parseRow(lines[0]).map(h => h.toLowerCase().replace(/['"]/g, ""));

    // Try to identify columns
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

        // If no description column found, try second column
        if (!description && cols.length > 1) {
            description = cols[1];
        }

        // If no date found, try first column
        if (!date && cols.length > 0) {
            date = cols[0];
        }

        // Parse amount
        if (debitCol >= 0 && creditCol >= 0) {
            const debitVal = parseFloat((cols[debitCol] || "0").replace(/[^\d.\-]/g, ""));
            const creditVal = parseFloat((cols[creditCol] || "0").replace(/[^\d.\-]/g, ""));
            if (!isNaN(creditVal) && creditVal > 0) {
                amount = creditVal;
                type = "credit";
            } else if (!isNaN(debitVal) && debitVal > 0) {
                amount = debitVal;
                type = "debit";
            }
        } else if (amountCol >= 0) {
            const rawAmount = (cols[amountCol] || "0").replace(/[^\d.\-]/g, "");
            const val = parseFloat(rawAmount);
            if (!isNaN(val)) {
                amount = Math.abs(val);
                type = val < 0 ? "debit" : "credit";
            }
        }

        // Validate
        if (!date || amount === 0 || !description) continue;
        if (!extractDate(date) && !/\d/.test(date)) continue;

        type = refineType(description, type);
        const category = categorizeTransaction(description);

        transactions.push({
            date: date.replace(/['"]/g, ""),
            description: description.replace(/['"]/g, ""),
            amount,
            type,
            category,
        });
    }

    return transactions;
}

async function parseExcelFile(file: File): Promise<Transaction[]> {
    const XLSX = await import("xlsx");
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const csvText = XLSX.utils.sheet_to_csv(firstSheet);
    return parseCSVContent(csvText);
}

// ─── PDF TRANSACTION PARSER ──────────────────────────────

function parseTransactionsFromText(text: string): Transaction[] {
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 5);
    const transactions: Transaction[] = [];

    for (const line of lines) {
        const date = extractDate(line);
        if (!date) continue;

        const amountInfo = extractAmount(line);
        if (!amountInfo) continue;

        // Extract description: everything between date and amount
        let description = line;
        // Remove date
        description = description.replace(date, "").trim();
        // Remove the amount portion
        const amountPatterns = [
            new RegExp(`(-?\\s*)(?:${CURRENCY_SYMBOL_REGEX_PART})\\s*([\\d,]+\\.?\\d{0,2})`, "g"),
            /([\d,]+\.?\d{0,2})\s*(CR|DR|Cr|Dr|cr|dr)\b/g,
            /([\d,]+\.\d{2})\s*$/g,
        ];
        for (const p of amountPatterns) {
            description = description.replace(p, "").trim();
        }
        // Clean up extra spaces
        description = description.replace(/\s+/g, " ").trim();

        if (description.length < 2) continue;

        const type = refineType(description, amountInfo.type);
        const category = categorizeTransaction(description);

        transactions.push({
            date,
            description,
            amount: amountInfo.amount,
            type,
            category,
            rawLine: line,
        });
    }

    return transactions;
}

// ─── ANALYSIS COMPUTATION ────────────────────────────────

function computeAnalysis(transactions: Transaction[], sourceFormat: string, currencyCode: string): AnalysisResult {
    const totalCredits = transactions
        .filter(t => t.type === "credit")
        .reduce((sum, t) => sum + t.amount, 0);
    const totalDebits = transactions
        .filter(t => t.type === "debit")
        .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown (debits only for spending)
    const catMap = new Map<string, { total: number; count: number }>();
    transactions.filter(t => t.type === "debit").forEach(t => {
        const existing = catMap.get(t.category) || { total: 0, count: 0 };
        existing.total += t.amount;
        existing.count += 1;
        catMap.set(t.category, existing);
    });

    const categories: CategoryBreakdown[] = Array.from(catMap.entries())
        .map(([category, data]) => ({
            category,
            totalAmount: data.total,
            count: data.count,
            percentage: totalDebits > 0 ? (data.total / totalDebits) * 100 : 0,
            color: getCategoryColor(category),
        }))
        .sort((a, b) => b.totalAmount - a.totalAmount);

    const largestDebit = transactions
        .filter(t => t.type === "debit")
        .sort((a, b) => b.amount - a.amount)[0] || null;
    const largestCredit = transactions
        .filter(t => t.type === "credit")
        .sort((a, b) => b.amount - a.amount)[0] || null;

    // Determine date range
    let dateRange: { from: string; to: string } | null = null;
    if (transactions.length > 0) {
        const dates = transactions.map(t => t.date);
        dateRange = { from: dates[0], to: dates[dates.length - 1] };
    }

    return {
        transactions,
        totalCredits,
        totalDebits,
        netChange: totalCredits - totalDebits,
        avgTransaction: transactions.length > 0
            ? (totalCredits + totalDebits) / transactions.length
            : 0,
        categories,
        largestDebit,
        largestCredit,
        dateRange,
        sourceFormat,
        currencyCode,
    };
}

// ─── COMPONENT ───────────────────────────────────────────

export default function BankStatementAnalyzerClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isPdf, setIsPdf] = useState(false);
    const { pdfProxy, pageCount, loading } = usePDF(isPdf ? file : null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [copied, setCopied] = useState(false);
    const [useOCR, setUseOCR] = useState(false);
    const [progress, setProgress] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "categories" | "summary">("overview");
    const [currency, setCurrency] = useState("USD");

    // Transaction table state
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState<"date" | "amount" | "category">("date");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [filterType, setFilterType] = useState<"all" | "credit" | "debit">("all");

    const handleFileSelected = useCallback((files: File[]) => {
        if (files.length > 0) {
            const f = files[0];
            setFile(f);
            setAnalysis(null);
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

    const performOCR = async (): Promise<string> => {
        if (!pdfProxy) return "";
        let fullText = "";
        const { createWorker } = await import("tesseract.js");
        const worker = await createWorker("eng");

        for (let i = 1; i <= pageCount; i++) {
            setProgress(`OCR: Page ${i} of ${pageCount}...`);
            const page = await pdfProxy.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (context) {
                await page.render({ canvasContext: context, viewport } as any).promise;
                const imageUrl = canvas.toDataURL("image/png");
                const { data: { text } } = await worker.recognize(imageUrl);
                fullText += text + "\n";
            }
        }
        await worker.terminate();
        return fullText;
    };

    // ─── ANALYZE HANDLER ─────────────────────────────────

    const handleAnalyze = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress("");
        setError(null);

        try {
            let transactions: Transaction[] = [];
            const ext = file.name.toLowerCase().split(".").pop() || "";

            if (ext === "csv") {
                setProgress("Parsing CSV file...");
                const text = await file.text();
                const detected = detectCurrency(text);
                setCurrency(detected);
                transactions = parseCSVContent(text);
            } else if (ext === "xlsx" || ext === "xls") {
                setProgress("Parsing Excel file...");
                transactions = await parseExcelFile(file);
            } else if (ext === "pdf") {
                if (!pdfProxy) {
                    setError("PDF is still loading. Please wait and try again.");
                    return;
                }
                let text = "";
                if (useOCR) {
                    text = await performOCR();
                } else {
                    text = await extractPdfText();
                }

                if (!text.trim()) {
                    setError("No text extracted. Try enabling OCR for scanned statements.");
                    return;
                }

                setProgress("Detecting currency & parsing transactions...");
                const detected = detectCurrency(text);
                setCurrency(detected);
                transactions = parseTransactionsFromText(text);
            } else {
                setError(`Unsupported file format: .${ext}. Please upload PDF, CSV, or Excel files.`);
                return;
            }

            if (transactions.length === 0) {
                setError("No transactions could be detected. The file format may not be recognized. Try a CSV or Excel export from your bank.");
                return;
            }

            setProgress("Computing analysis...");
            const result = computeAnalysis(transactions, ext.toUpperCase(), currency);
            setAnalysis(result);
            setActiveTab("overview");
        } catch (err: any) {
            console.error("Analysis failed:", err);
            setError(err.message || "Failed to analyze file. Please try again.");
        } finally {
            setIsProcessing(false);
            setProgress("");
        }
    };

    // ─── FILTERED + SORTED TRANSACTIONS ──────────────────

    const filteredTransactions = useMemo(() => {
        if (!analysis) return [];
        let txns = [...analysis.transactions];

        // Type filter
        if (filterType !== "all") {
            txns = txns.filter(t => t.type === filterType);
        }

        // Search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            txns = txns.filter(t =>
                t.description.toLowerCase().includes(q) ||
                t.category.toLowerCase().includes(q) ||
                t.date.includes(q)
            );
        }

        // Sort
        txns.sort((a, b) => {
            let cmp = 0;
            if (sortField === "amount") cmp = a.amount - b.amount;
            else if (sortField === "category") cmp = a.category.localeCompare(b.category);
            else cmp = a.date.localeCompare(b.date);
            return sortDir === "desc" ? -cmp : cmp;
        });

        return txns;
    }, [analysis, filterType, searchQuery, sortField, sortDir]);

    // ─── EXPORT ──────────────────────────────────────────

    const handleCopy = () => {
        if (!analysis) return;
        navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadCSV = () => {
        if (!analysis) return;
        const ci = getCurrencyInfo(currency);

        let csv = "Bank Statement Analysis Report\n";
        csv += `Currency,${ci.code} (${ci.name})\n\n`;
        csv += "SUMMARY\n";
        csv += `Total Credits,${ci.symbol}${analysis.totalCredits.toFixed(2)}\n`;
        csv += `Total Debits,${ci.symbol}${analysis.totalDebits.toFixed(2)}\n`;
        csv += `Net Change,${ci.symbol}${analysis.netChange.toFixed(2)}\n`;
        csv += `Total Transactions,${analysis.transactions.length}\n`;
        csv += `Avg Transaction,${ci.symbol}${analysis.avgTransaction.toFixed(2)}\n\n`;

        csv += "TRANSACTIONS\n";
        csv += "Date,Description,Amount,Type,Category\n";
        analysis.transactions.forEach(t => {
            csv += `${t.date},"${t.description}",${t.type === "debit" ? "-" : ""}${t.amount.toFixed(2)},${t.type},${t.category}\n`;
        });

        csv += "\nCATEGORY BREAKDOWN\n";
        csv += "Category,Total Amount,Count,Percentage\n";
        analysis.categories.forEach(c => {
            csv += `${c.category},${ci.symbol}${c.totalAmount.toFixed(2)},${c.count},${c.percentage.toFixed(1)}%\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `bank_analysis_${file?.name.replace(/\.[^.]+$/, "")}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const fmt = (n: number) => {
        const ci = getCurrencyInfo(currency);
        return `${ci.symbol}${Math.abs(n).toLocaleString(ci.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const toggleSort = (field: "date" | "amount" | "category") => {
        if (sortField === field) {
            setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDir("asc");
        }
    };

    // ─── RENDER ──────────────────────────────────────────

    return (
        <ToolPageWrapper
            title="Bank Statement Analyzer"
            description="Upload & analyze bank statements — rule-based, no AI, 100% private."
            icon={Landmark}
            color="red"
        >
            {/* ─── STEP 1: UPLOAD ─── */}
            {!file ? (
                <RetroCard className="max-w-2xl mx-auto">
                    <div className="mb-4 p-3 bg-[#FACC15]/15 border-2 border-black text-sm font-sans">
                        <strong className="font-display">Supported formats:</strong> PDF, CSV, Excel (.xlsx / .xls)
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

                /* ─── STEP 2: CONFIGURE & ANALYZE ─── */
            ) : !analysis ? (
                <RetroCard className="max-w-xl mx-auto">
                    {/* File Info */}
                    <div className="flex items-center space-x-4 mb-6 p-4 bg-[#F87171]/10 border-2 border-black">
                        <div className="p-3 bg-[#F87171] border-2 border-black">
                            {isPdf ? <Landmark className="w-6 h-6" /> : <FileSpreadsheet className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-display truncate">{file.name}</h2>
                            <p className="text-sm text-gray-600 font-sans">
                                {isPdf ? `${pageCount} pages • ` : ""}{(file.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                        <button
                            onClick={() => { setFile(null); setIsPdf(false); }}
                            className="px-4 py-2 border-2 border-black bg-white hover:bg-[#F87171] font-display text-sm transition-colors"
                        >
                            Change
                        </button>
                    </div>

                    {/* OCR Option (PDF only) */}
                    {isPdf && (
                        <label className="flex items-center space-x-2 mb-6 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={useOCR}
                                onChange={(e) => setUseOCR(e.target.checked)}
                                className="w-5 h-5 border-2 border-black accent-[#F87171]"
                            />
                            <span className="font-sans text-sm">
                                Enable OCR (for scanned statements) — Slower but needed for image-based PDFs
                            </span>
                        </label>
                    )}

                    {/* Currency Selector */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 mb-2 text-sm font-display">
                            <Globe className="w-4 h-4" /> Currency
                        </label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-black font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F87171]"
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
                        label="Analyze Statement"
                        isProcessing={isProcessing}
                        processingText={progress || "Processing..."}
                        onClick={handleAnalyze}
                        disabled={isPdf && loading}
                        color="red"
                        icon={<BarChart3 className="w-5 h-5" />}
                    />

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border-2 border-red-500 text-red-700 font-sans flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </RetroCard>

                /* ─── STEP 3: RESULTS DASHBOARD ─── */
            ) : (
                <div className="space-y-6">
                    {/* Header + Actions */}
                    <RetroCard>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#F87171] border-2 border-black">
                                    <Landmark className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-display">Analysis Complete</h2>
                                    <p className="text-sm text-gray-500 font-sans">
                                        {analysis.transactions.length} transactions from {analysis.sourceFormat} • {file.name} • {getCurrencyInfo(currency).symbol} {currency}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <button onClick={handleCopy}
                                    className="flex items-center px-4 py-2 text-sm font-display border-2 border-black bg-white hover:bg-gray-100 transition-colors">
                                    {copied ? <CheckCircle2 className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
                                    {copied ? "Copied!" : "Copy JSON"}
                                </button>
                                <button onClick={handleDownloadCSV}
                                    className="flex items-center px-4 py-2 text-sm font-display border-2 border-black bg-[#F87171] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                                    <Download className="w-4 h-4 mr-1" />
                                    Download CSV
                                </button>
                            </div>
                        </div>
                    </RetroCard>

                    {/* Tab Navigation */}
                    <div className="flex gap-0 border-2 border-black overflow-hidden">
                        {([
                            { key: "overview" as const, label: "Overview", icon: BarChart3 },
                            { key: "transactions" as const, label: "Transactions", icon: ArrowUpDown },
                            { key: "categories" as const, label: "Categories", icon: PiggyBank },
                            { key: "summary" as const, label: "Summary", icon: FileSpreadsheet },
                        ]).map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-display transition-colors border-r-2 border-black last:border-r-0 ${activeTab === tab.key ? "bg-[#F87171] text-black" : "bg-white hover:bg-gray-50"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* ─── TAB: OVERVIEW ─── */}
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            {/* Financial Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <SummaryCard label="Total Income" value={fmt(analysis.totalCredits)} icon={TrendingUp} color="bg-[#34D399]" />
                                <SummaryCard label="Total Expenses" value={fmt(analysis.totalDebits)} icon={TrendingDown} color="bg-[#F87171]" />
                                <SummaryCard label="Net Change" value={`${analysis.netChange >= 0 ? "+" : "-"}${fmt(analysis.netChange)}`}
                                    icon={Wallet} color={analysis.netChange >= 0 ? "bg-[#34D399]" : "bg-[#FB923C]"} />
                                <SummaryCard label="Transactions" value={String(analysis.transactions.length)} icon={Banknote} color="bg-[#60A5FA]" />
                            </div>

                            {/* Date Range */}
                            {analysis.dateRange && (
                                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-2 border-black text-sm font-sans">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>Period: <strong className="font-display">{analysis.dateRange.from}</strong> → <strong className="font-display">{analysis.dateRange.to}</strong></span>
                                </div>
                            )}

                            {/* Top Category Chart */}
                            {analysis.categories.length > 0 && (
                                <RetroCard>
                                    <h3 className="text-lg font-display mb-4">Top Spending Categories</h3>
                                    <div className="space-y-3">
                                        {analysis.categories.slice(0, 6).map((cat, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <span className="font-sans text-sm w-36 truncate text-right">{cat.category}</span>
                                                <div className="flex-1 h-7 bg-gray-100 border border-black relative overflow-hidden">
                                                    <div
                                                        className="h-full transition-all duration-700 ease-out flex items-center px-2"
                                                        style={{ width: `${Math.max(cat.percentage, 3)}%`, backgroundColor: cat.color }}
                                                    >
                                                        {cat.percentage > 15 && (
                                                            <span className="text-xs font-display text-black/70">{cat.percentage.toFixed(0)}%</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="font-display text-sm w-24 text-right">{fmt(cat.totalAmount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </RetroCard>
                            )}

                            {/* Largest Transactions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {analysis.largestDebit && (
                                    <div className="p-4 border-2 border-black bg-[#F87171]/10">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-sans mb-1">
                                            <ArrowDown className="w-3 h-3" /> Largest Expense
                                        </div>
                                        <div className="font-display text-xl text-red-600">-{fmt(analysis.largestDebit.amount)}</div>
                                        <div className="text-sm font-sans text-gray-600 mt-1 truncate">{analysis.largestDebit.description}</div>
                                        <div className="text-xs font-sans text-gray-400">{analysis.largestDebit.date}</div>
                                    </div>
                                )}
                                {analysis.largestCredit && (
                                    <div className="p-4 border-2 border-black bg-[#34D399]/10">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-sans mb-1">
                                            <ArrowUp className="w-3 h-3" /> Largest Income
                                        </div>
                                        <div className="font-display text-xl text-green-600">+{fmt(analysis.largestCredit.amount)}</div>
                                        <div className="text-sm font-sans text-gray-600 mt-1 truncate">{analysis.largestCredit.description}</div>
                                        <div className="text-xs font-sans text-gray-400">{analysis.largestCredit.date}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ─── TAB: TRANSACTIONS ─── */}
                    {activeTab === "transactions" && (
                        <RetroCard>
                            {/* Controls */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search transactions..."
                                        className="w-full pl-9 pr-3 py-2 border-2 border-black font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#F87171]"
                                    />
                                </div>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as "all" | "credit" | "debit")}
                                    className="px-3 py-2 border-2 border-black font-display text-sm bg-white"
                                >
                                    <option value="all">All Types</option>
                                    <option value="credit">Credits Only</option>
                                    <option value="debit">Debits Only</option>
                                </select>
                            </div>

                            <div className="text-xs font-sans text-gray-400 mb-2">
                                Showing {filteredTransactions.length} of {analysis.transactions.length} transactions
                            </div>

                            {/* Table */}
                            <div className="border-2 border-black overflow-auto max-h-[500px]">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 sticky top-0">
                                        <tr>
                                            <th onClick={() => toggleSort("date")}
                                                className="text-left px-4 py-2 font-display border-b-2 border-black cursor-pointer hover:bg-gray-200 select-none">
                                                <span className="flex items-center gap-1">
                                                    Date {sortField === "date" && (sortDir === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
                                                </span>
                                            </th>
                                            <th className="text-left px-4 py-2 font-display border-b-2 border-black">Description</th>
                                            <th onClick={() => toggleSort("category")}
                                                className="text-left px-4 py-2 font-display border-b-2 border-black cursor-pointer hover:bg-gray-200 select-none">
                                                <span className="flex items-center gap-1">
                                                    Category {sortField === "category" && (sortDir === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
                                                </span>
                                            </th>
                                            <th onClick={() => toggleSort("amount")}
                                                className="text-right px-4 py-2 font-display border-b-2 border-black cursor-pointer hover:bg-gray-200 select-none">
                                                <span className="flex items-center gap-1 justify-end">
                                                    Amount {sortField === "amount" && (sortDir === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransactions.map((t, i) => (
                                            <tr key={i} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                                <td className="px-4 py-2 font-sans text-gray-500 whitespace-nowrap">{t.date}</td>
                                                <td className="px-4 py-2 font-sans max-w-[220px] truncate" title={t.description}>{t.description}</td>
                                                <td className="px-4 py-2">
                                                    <span className="inline-block px-2 py-0.5 text-xs font-display border border-black"
                                                        style={{ backgroundColor: getCategoryColor(t.category) + "30" }}>
                                                        {t.category}
                                                    </span>
                                                </td>
                                                <td className={`px-4 py-2 text-right font-display whitespace-nowrap ${t.type === "credit" ? "text-green-600" : "text-red-600"
                                                    }`}>
                                                    {t.type === "credit" ? "+" : "-"}{fmt(t.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </RetroCard>
                    )}

                    {/* ─── TAB: CATEGORIES ─── */}
                    {activeTab === "categories" && (
                        <RetroCard>
                            <h3 className="text-lg font-display mb-4">Expense Breakdown by Category</h3>
                            {analysis.categories.length === 0 ? (
                                <p className="text-gray-500 font-sans text-sm">No expense categories found.</p>
                            ) : (
                                <div className="space-y-3">
                                    {analysis.categories.map((cat, i) => (
                                        <div key={i} className="border-2 border-black p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 border border-black" style={{ backgroundColor: cat.color }} />
                                                    <span className="font-display text-sm">{cat.category}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-sans text-gray-500">{cat.count} txn{cat.count !== 1 ? "s" : ""}</span>
                                                    <span className="font-display text-lg">{fmt(cat.totalAmount)}</span>
                                                </div>
                                            </div>
                                            <div className="w-full h-5 bg-gray-100 border border-black overflow-hidden">
                                                <div
                                                    className="h-full transition-all duration-700 ease-out"
                                                    style={{ width: `${Math.min(cat.percentage, 100)}%`, backgroundColor: cat.color }}
                                                />
                                            </div>
                                            <div className="text-right text-xs font-sans text-gray-500 mt-1">
                                                {cat.percentage.toFixed(1)}% of total spending
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </RetroCard>
                    )}

                    {/* ─── TAB: SUMMARY ─── */}
                    {activeTab === "summary" && (
                        <div className="space-y-6">
                            {/* Financial Overview */}
                            <RetroCard>
                                <h3 className="text-lg font-display mb-4">Financial Overview</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <InfoField label="Source Format" value={analysis.sourceFormat} />
                                    <InfoField label="Total Transactions" value={String(analysis.transactions.length)} />
                                    <InfoField label="Total Income" value={fmt(analysis.totalCredits)} />
                                    <InfoField label="Total Expenses" value={fmt(analysis.totalDebits)} />
                                    <InfoField label="Net Change" value={`${analysis.netChange >= 0 ? "+" : "-"}${fmt(analysis.netChange)}`} highlight={analysis.netChange >= 0} />
                                    <InfoField label="Avg Transaction" value={fmt(analysis.avgTransaction)} />
                                    <InfoField label="Income Transactions" value={String(analysis.transactions.filter(t => t.type === "credit").length)} />
                                    <InfoField label="Expense Transactions" value={String(analysis.transactions.filter(t => t.type === "debit").length)} />
                                </div>
                            </RetroCard>

                            {/* Top 5 Expenses */}
                            <RetroCard>
                                <h3 className="text-lg font-display mb-4">Top 5 Expenses</h3>
                                <div className="space-y-2">
                                    {analysis.transactions
                                        .filter(t => t.type === "debit")
                                        .sort((a, b) => b.amount - a.amount)
                                        .slice(0, 5)
                                        .map((t, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 border-2 border-black hover:bg-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 flex items-center justify-center bg-[#F87171] border border-black text-xs font-display">{i + 1}</span>
                                                    <div>
                                                        <div className="font-sans text-sm truncate max-w-[200px]">{t.description}</div>
                                                        <div className="text-xs text-gray-400 font-sans">{t.date} • {t.category}</div>
                                                    </div>
                                                </div>
                                                <span className="font-display text-red-600">-{fmt(t.amount)}</span>
                                            </div>
                                        ))}
                                </div>
                            </RetroCard>

                            {/* Top 5 Income */}
                            <RetroCard>
                                <h3 className="text-lg font-display mb-4">Top 5 Income</h3>
                                <div className="space-y-2">
                                    {analysis.transactions
                                        .filter(t => t.type === "credit")
                                        .sort((a, b) => b.amount - a.amount)
                                        .slice(0, 5)
                                        .map((t, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 border-2 border-black hover:bg-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 flex items-center justify-center bg-[#34D399] border border-black text-xs font-display">{i + 1}</span>
                                                    <div>
                                                        <div className="font-sans text-sm truncate max-w-[200px]">{t.description}</div>
                                                        <div className="text-xs text-gray-400 font-sans">{t.date} • {t.category}</div>
                                                    </div>
                                                </div>
                                                <span className="font-display text-green-600">+{fmt(t.amount)}</span>
                                            </div>
                                        ))}
                                </div>
                            </RetroCard>

                            {/* Categories Summary */}
                            <RetroCard>
                                <h3 className="text-lg font-display mb-4">Category Summary</h3>
                                <div className="border-2 border-black overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="text-left px-4 py-2 font-display border-b-2 border-black">Category</th>
                                                <th className="text-right px-4 py-2 font-display border-b-2 border-black">Amount</th>
                                                <th className="text-right px-4 py-2 font-display border-b-2 border-black">Count</th>
                                                <th className="text-right px-4 py-2 font-display border-b-2 border-black">%</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analysis.categories.map((cat, i) => (
                                                <tr key={i} className="border-b border-gray-200 last:border-b-0">
                                                    <td className="px-4 py-2 font-sans flex items-center gap-2">
                                                        <div className="w-3 h-3 border border-black shrink-0" style={{ backgroundColor: cat.color }} />
                                                        {cat.category}
                                                    </td>
                                                    <td className="px-4 py-2 text-right font-display">{fmt(cat.totalAmount)}</td>
                                                    <td className="px-4 py-2 text-right font-sans">{cat.count}</td>
                                                    <td className="px-4 py-2 text-right font-display">{cat.percentage.toFixed(1)}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </RetroCard>
                        </div>
                    )}

                    {/* Reset */}
                    <button
                        onClick={() => { setFile(null); setAnalysis(null); setIsPdf(false); }}
                        className="w-full py-3 border-2 border-black bg-white hover:bg-gray-100 font-display transition-colors"
                    >
                        Analyze Another Statement
                    </button>
                </div>
            )}
        </ToolPageWrapper>
    );
}

// ─── Sub-components ──────────────────────────────────────

function InfoField({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className={`p-3 border-2 border-black ${highlight ? "bg-[#34D399]/15" : "bg-white"}`}>
            <div className="text-xs text-gray-500 font-sans mb-1">{label}</div>
            <div className="font-display text-sm">{value || "—"}</div>
        </div>
    );
}

function SummaryCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
    return (
        <div className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 border border-black ${color}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs text-gray-500 font-sans">{label}</span>
            </div>
            <div className="font-display text-xl">{value}</div>
        </div>
    );
}
