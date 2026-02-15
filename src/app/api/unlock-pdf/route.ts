import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, PDFName, PDFHexString, PDFString } from 'pdf-lib';
import { md5, RC4, hexToBytes } from '@pdfsmaller/pdf-encrypt-lite';
import { handleApiError, handleBadRequest } from '@/lib/api-utils';

// Standard PDF padding string (from PDF specification)
const PADDING = new Uint8Array([
    0x28, 0xBF, 0x4E, 0x5E, 0x4E, 0x75, 0x8A, 0x41,
    0x64, 0x00, 0x4E, 0x56, 0xFF, 0xFA, 0x01, 0x08,
    0x2E, 0x2E, 0x00, 0xB6, 0xD0, 0x68, 0x3E, 0x80,
    0x2F, 0x0C, 0xA9, 0xFE, 0x64, 0x53, 0x69, 0x7A
]);

function padPassword(password: string): Uint8Array {
    const pwdBytes = new TextEncoder().encode(password);
    const padded = new Uint8Array(32);
    if (pwdBytes.length >= 32) {
        padded.set(pwdBytes.slice(0, 32));
    } else {
        padded.set(pwdBytes);
        padded.set(PADDING.slice(0, 32 - pwdBytes.length), pwdBytes.length);
    }
    return padded;
}

function computeEncryptionKey(
    password: string,
    ownerKey: Uint8Array,
    permissions: number,
    fileId: Uint8Array,
    keyLength: number,
    revision: number
): Uint8Array {
    const paddedPwd = padPassword(password);
    const hashInput = new Uint8Array(
        paddedPwd.length + ownerKey.length + 4 + fileId.length
    );
    let offset = 0;
    hashInput.set(paddedPwd, offset); offset += paddedPwd.length;
    hashInput.set(ownerKey, offset); offset += ownerKey.length;
    hashInput[offset++] = permissions & 0xFF;
    hashInput[offset++] = (permissions >> 8) & 0xFF;
    hashInput[offset++] = (permissions >> 16) & 0xFF;
    hashInput[offset++] = (permissions >> 24) & 0xFF;
    hashInput.set(fileId, offset);

    let hash = md5(hashInput);
    if (revision >= 3) {
        for (let i = 0; i < 50; i++) {
            hash = md5(hash.slice(0, keyLength));
        }
    }
    return hash.slice(0, keyLength);
}

function verifyUserPassword(
    password: string,
    uValue: Uint8Array,
    ownerKey: Uint8Array,
    permissions: number,
    fileId: Uint8Array,
    keyLength: number,
    revision: number
): Uint8Array | null {
    const encKey = computeEncryptionKey(password, ownerKey, permissions, fileId, keyLength, revision);

    if (revision === 2) {
        const rc4 = new RC4(encKey);
        const computed = rc4.process(new Uint8Array(PADDING));
        if (arraysEqual(computed, uValue)) return encKey;
        return null;
    }

    // Revision 3+
    const hashInput = new Uint8Array(PADDING.length + fileId.length);
    hashInput.set(PADDING);
    hashInput.set(fileId, PADDING.length);
    const hash = md5(hashInput);
    const rc4 = new RC4(encKey);
    let result = rc4.process(hash);
    for (let i = 1; i <= 19; i++) {
        const key = new Uint8Array(encKey.length);
        for (let j = 0; j < encKey.length; j++) {
            key[j] = encKey[j] ^ i;
        }
        const rc4iter = new RC4(key);
        result = rc4iter.process(result);
    }
    // Compare first 16 bytes only for revision 3
    if (arraysEqual(result.slice(0, 16), uValue.slice(0, 16))) return encKey;
    return null;
}

function verifyOwnerPassword(
    ownerPassword: string,
    oValue: Uint8Array,
    uValue: Uint8Array,
    permissions: number,
    fileId: Uint8Array,
    keyLength: number,
    revision: number
): Uint8Array | null {
    const paddedOwner = padPassword(ownerPassword);
    let hash = md5(paddedOwner);
    if (revision >= 3) {
        for (let i = 0; i < 50; i++) {
            hash = md5(hash);
        }
    }
    const ownerEncKey = hash.slice(0, keyLength);

    let userPassword: Uint8Array;
    if (revision === 2) {
        const rc4 = new RC4(ownerEncKey);
        userPassword = rc4.process(new Uint8Array(oValue));
    } else {
        userPassword = new Uint8Array(oValue);
        for (let i = 19; i >= 0; i--) {
            const key = new Uint8Array(ownerEncKey.length);
            for (let j = 0; j < ownerEncKey.length; j++) {
                key[j] = ownerEncKey[j] ^ i;
            }
            const rc4 = new RC4(key);
            userPassword = rc4.process(userPassword);
        }
    }

    // The decrypted value is the padded user password, use it to try user auth
    const decryptedPwdStr = new TextDecoder('latin1').decode(userPassword);
    return verifyUserPassword(decryptedPwdStr, uValue, oValue, permissions, fileId, keyLength, revision);
}

function arraysEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function decryptObject(
    data: Uint8Array,
    objectNum: number,
    generationNum: number,
    encryptionKey: Uint8Array
): Uint8Array {
    const keyInput = new Uint8Array(encryptionKey.length + 5);
    keyInput.set(encryptionKey);
    keyInput[encryptionKey.length] = objectNum & 0xFF;
    keyInput[encryptionKey.length + 1] = (objectNum >> 8) & 0xFF;
    keyInput[encryptionKey.length + 2] = (objectNum >> 16) & 0xFF;
    keyInput[encryptionKey.length + 3] = generationNum & 0xFF;
    keyInput[encryptionKey.length + 4] = (generationNum >> 8) & 0xFF;
    const objectKey = md5(keyInput);
    const rc4 = new RC4(objectKey.slice(0, Math.min(encryptionKey.length + 5, 16)));
    return rc4.process(data);
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const password = formData.get('password') as string | '';

        if (!file) {
            return handleBadRequest("PDF file is required");
        }

        console.log(`Processing file: ${file.name}`);

        const arrayBuffer = await file.arrayBuffer();
        const pdfBytes = new Uint8Array(arrayBuffer);

        // Load with ignoreEncryption to access the structure
        const pdfDoc = await PDFDocument.load(pdfBytes, {
            ignoreEncryption: true,
            updateMetadata: false,
        } as any);

        const context = pdfDoc.context;
        const trailer = context.trailerInfo;

        // Check if PDF is actually encrypted
        const encryptRef = (trailer as any).Encrypt;
        if (!encryptRef) {
            console.log("PDF is not encrypted");
            // PDF is not encrypted, just return it as-is
            const cleanBytes = await pdfDoc.save();
            return new NextResponse(Buffer.from(cleanBytes), {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename="unlocked.pdf"',
                    'Content-Length': cleanBytes.length.toString(),
                },
            });
        }

        // Get the encrypt dictionary
        const encryptDict = context.lookup(encryptRef) as any;
        if (!encryptDict) {
            console.error("Could not read encryption dictionary");
            return handleBadRequest("Could not read encryption dictionary");
        }

        // Extract encryption parameters
        const revision = encryptDict.get(PDFName.of('R'))?.asNumber?.() ?? 3;
        const version = encryptDict.get(PDFName.of('V'))?.asNumber?.() ?? 2;
        const lengthBits = encryptDict.get(PDFName.of('Length'))?.asNumber?.() ?? 128;
        const keyLength = Math.min(lengthBits / 8, 16);
        const permissions = encryptDict.get(PDFName.of('P'))?.asNumber?.() ?? 0;

        console.log(`Encryption params: R=${revision}, V=${version}, Length=${lengthBits}, P=${permissions}`);

        if (revision > 4) {
            console.error(`Unsupported PDF revision: ${revision}. Only RC4/AES up to V4 is supported locally.`);
            return handleBadRequest("This PDF uses advanced encryption (AES-256) which is not currently supported by our local unlocker.");
        }

        // Get O and U values
        const oEntry = encryptDict.get(PDFName.of('O'));
        const uEntry = encryptDict.get(PDFName.of('U'));
        if (!oEntry || !uEntry) {
            return handleBadRequest("Missing encryption keys in PDF");
        }

        const oValue = oEntry instanceof PDFHexString
            ? hexToBytes(oEntry.asString())
            : oEntry.asBytes();
        const uValue = uEntry instanceof PDFHexString
            ? hexToBytes(uEntry.asString())
            : uEntry.asBytes();

        // Get file ID
        let fileId: Uint8Array;
        const idArray = (trailer as any).ID;
        if (idArray && idArray.size?.() > 0) {
            const firstId = idArray.lookup(0, PDFHexString) ?? idArray.lookup(0, PDFString);
            if (firstId instanceof PDFHexString) {
                fileId = hexToBytes(firstId.asString());
            } else if (firstId) {
                fileId = firstId.asBytes();
            } else {
                fileId = new Uint8Array(16);
            }
        } else if (idArray && Array.isArray(idArray)) {
            const idString = idArray[0].toString();
            const hexStr = idString.replace(/^<|>$/g, '');
            fileId = hexToBytes(hexStr);
        } else {
            fileId = new Uint8Array(16);
        }

        console.log("Verifying password...");

        // Verify password (try as user password first, then as owner password)
        const pwd = password || '';
        let encryptionKey = verifyUserPassword(pwd, uValue, oValue, permissions, fileId, keyLength, revision);
        if (encryptionKey) {
            console.log("Unlocked with User Password");
        } else {
            encryptionKey = verifyOwnerPassword(pwd, oValue, uValue, permissions, fileId, keyLength, revision);
            if (encryptionKey) console.log("Unlocked with Owner Password");
        }

        if (!encryptionKey) {
            console.warn("Password verification failed");
            return NextResponse.json(
                { error: "Incorrect password. Please try again." },
                { status: 401 }
            );
        }

        // Decrypt all objects
        const { PDFRawStream, PDFString: PDFStr, PDFDict: PDFDct, PDFArray: PDFArr } = await import('pdf-lib');

        const indirectObjects = context.enumerateIndirectObjects();
        const encryptObjNum = encryptRef.objectNumber;

        for (const [ref, obj] of indirectObjects) {
            const objectNum = ref.objectNumber;
            const generationNum = ref.generationNumber || 0;

            // Skip the encryption dictionary itself
            if (objectNum === encryptObjNum) continue;

            // Decrypt streams
            if (obj instanceof PDFRawStream) {
                const streamData = obj.contents;
                (obj as any).contents = decryptObject(streamData, objectNum, generationNum, encryptionKey);
            }

            // Decrypt strings recursively
            decryptStringsInObject(obj, objectNum, generationNum, encryptionKey, PDFStr, PDFHexString, PDFDct, PDFArr);
        }

        // Remove the encryption dictionary reference from trailer
        delete (trailer as any).Encrypt;

        // Save without encryption
        const cleanBytes = await pdfDoc.save({ useObjectStreams: false });

        return new NextResponse(Buffer.from(cleanBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="unlocked.pdf"',
                'Content-Length': cleanBytes.length.toString(),
            },
        });

    } catch (error) {
        return handleApiError(error, "Incorrect password or internal error");
    }
}

function decryptStringsInObject(
    obj: any,
    objectNum: number,
    generationNum: number,
    encryptionKey: Uint8Array,
    PDFStr: any,
    PDFHex: any,
    PDFDct: any,
    PDFArr: any
): void {
    if (!obj) return;

    if (obj instanceof PDFStr) {
        const originalBytes = obj.asBytes();
        const decrypted = decryptObject(originalBytes, objectNum, generationNum, encryptionKey);
        // Replace with decrypted hex string
        const hex = Array.from(decrypted).map((b: number) => b.toString(16).padStart(2, '0')).join('');
        obj.value = hex;
    } else if (obj instanceof PDFHex) {
        const originalBytes = hexToBytes(obj.asString());
        const decrypted = decryptObject(originalBytes, objectNum, generationNum, encryptionKey);
        const hex = Array.from(decrypted).map((b: number) => b.toString(16).padStart(2, '0')).join('');
        obj.value = hex;
    } else if (obj instanceof PDFDct) {
        const entries = obj.entries();
        for (const [key, value] of entries) {
            const keyName = key.asString();
            if (keyName !== '/Length' && keyName !== '/Filter' && keyName !== '/DecodeParms') {
                decryptStringsInObject(value, objectNum, generationNum, encryptionKey, PDFStr, PDFHex, PDFDct, PDFArr);
            }
        }
    } else if (obj instanceof PDFArr) {
        const array = obj.asArray();
        for (const element of array) {
            decryptStringsInObject(element, objectNum, generationNum, encryptionKey, PDFStr, PDFHex, PDFDct, PDFArr);
        }
    }
}


