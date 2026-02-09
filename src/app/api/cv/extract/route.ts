import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        // Check if it's a PDF by magic bytes
        const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46; // %PDF

        let text = '';

        if (isPdf) {
            text = await extractTextFromPdf(bytes);
        } else {
            // Plain text file
            text = new TextDecoder().decode(bytes);
        }

        if (!text.trim()) {
            return NextResponse.json(
                { error: 'Kunde inte extrahera text från filen. PDF:en kan vara skannad (bild) eller ha en ovanlig kodning. Prova att kopiera och klistra in texten istället.' },
                { status: 422 }
            );
        }

        return NextResponse.json({ text: text.trim() });
    } catch (error) {
        console.error('PDF extract error:', error);
        return NextResponse.json(
            { error: 'Failed to process file' },
            { status: 500 }
        );
    }
}

/**
 * PDF text extraction that handles both compressed (FlateDecode) and uncompressed streams.
 * Uses DecompressionStream API (available in Edge Runtime / Cloudflare Workers).
 */
async function extractTextFromPdf(bytes: Uint8Array): Promise<string> {
    const content = new TextDecoder('latin1').decode(bytes);
    const textParts: string[] = [];

    // First, try to decompress FlateDecode streams and extract text from them
    const compressedTexts = await extractFromCompressedStreams(bytes, content);
    textParts.push(...compressedTexts);

    // Also try uncompressed BT/ET text extraction
    const uncompressedTexts = extractTextFromContent(content);
    textParts.push(...uncompressedTexts);

    // Deduplicate and join
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const part of textParts) {
        const normalized = part.trim();
        if (normalized && !seen.has(normalized)) {
            seen.add(normalized);
            unique.push(normalized);
        }
    }

    return unique.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Find and decompress FlateDecode streams, then extract text from them.
 */
async function extractFromCompressedStreams(bytes: Uint8Array, content: string): Promise<string[]> {
    const textParts: string[] = [];

    // Find stream positions with FlateDecode filter
    // Look for patterns like: /Filter /FlateDecode ... stream\r\n...endstream
    const streamRegex = /stream\r?\n/g;
    const endstreamRegex = /\r?\nendstream/g;

    let streamMatch;
    while ((streamMatch = streamRegex.exec(content)) !== null) {
        const streamStart = streamMatch.index + streamMatch[0].length;

        // Find the matching endstream
        endstreamRegex.lastIndex = streamStart;
        const endMatch = endstreamRegex.exec(content);
        if (!endMatch) continue;

        const streamEnd = endMatch.index;
        if (streamEnd <= streamStart || streamEnd - streamStart > 1000000) continue;

        // Check if this stream has FlateDecode filter (look backwards from stream for /FlateDecode)
        const preContext = content.substring(Math.max(0, streamMatch.index - 500), streamMatch.index);
        const isFlateDecode = /\/FlateDecode/i.test(preContext) || /\/Filter\s*\/Fl/i.test(preContext);

        if (!isFlateDecode) continue;

        // Extract the raw bytes of the compressed stream
        const compressedBytes = bytes.slice(streamStart, streamEnd);

        try {
            const decompressed = await decompressDeflate(compressedBytes);
            if (decompressed) {
                const decompressedText = new TextDecoder('latin1').decode(decompressed);
                const extracted = extractTextFromContent(decompressedText);
                textParts.push(...extracted);
            }
        } catch {
            // Skip streams that fail to decompress
        }
    }

    return textParts;
}

/**
 * Decompress a FlateDecode (zlib/deflate) compressed stream.
 * Uses the web standard DecompressionStream API.
 */
async function decompressDeflate(compressed: Uint8Array): Promise<Uint8Array | null> {
    // Try both 'deflate' (zlib wrapper) and 'raw' deflate
    for (const format of ['deflate', 'deflate-raw'] as const) {
        try {
            const ds = new DecompressionStream(format);
            const writer = ds.writable.getWriter();
            const reader = ds.readable.getReader();

            writer.write(compressed as unknown as BufferSource).catch(() => { });
            writer.close().catch(() => { });

            const chunks: Uint8Array[] = [];
            let totalLength = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                totalLength += value.length;
                if (totalLength > 10 * 1024 * 1024) break; // Safety limit 10MB
            }

            if (totalLength === 0) continue;

            const result = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
                result.set(chunk, offset);
                offset += chunk.length;
            }

            return result;
        } catch {
            continue;
        }
    }
    return null;
}

/**
 * Extract text from PDF content (works on both raw and decompressed content).
 * Looks for BT/ET text blocks with Tj and TJ operators.
 */
function extractTextFromContent(content: string): string[] {
    const textParts: string[] = [];

    // Extract text between BT and ET markers (text objects)
    const btEtRegex = /BT\s([\s\S]*?)ET/g;
    let match;

    while ((match = btEtRegex.exec(content)) !== null) {
        const textBlock = match[1];

        // Extract text from Tj operator (show text)
        const tjRegex = /\(([^)]*)\)\s*Tj/g;
        let tjMatch;
        while ((tjMatch = tjRegex.exec(textBlock)) !== null) {
            const decoded = decodePdfString(tjMatch[1]);
            if (decoded.trim()) textParts.push(decoded);
        }

        // Extract text from TJ operator (show text with positioning)
        const tjArrayRegex = /\[((?:[^[\]]*|\[[^\]]*\])*)\]\s*TJ/gi;
        let tjArrayMatch;
        while ((tjArrayMatch = tjArrayRegex.exec(textBlock)) !== null) {
            const arrayContent = tjArrayMatch[1];
            const stringRegex = /\(([^)]*)\)/g;
            let strMatch;
            let lineText = '';
            while ((strMatch = stringRegex.exec(arrayContent)) !== null) {
                lineText += decodePdfString(strMatch[1]);
            }
            if (lineText.trim()) textParts.push(lineText);
        }

        // Check for large spacing (Td/TD with big y-offset = new line)
        if (textParts.length > 0) {
            const tdRegex = /[\d.-]+\s+([\d.-]+)\s+Td/g;
            let tdMatch;
            while ((tdMatch = tdRegex.exec(textBlock)) !== null) {
                const yOffset = parseFloat(tdMatch[1]);
                if (Math.abs(yOffset) > 10) {
                    // Significant vertical movement = likely new paragraph
                    textParts.push('\n');
                }
            }
        }
    }

    // Fallback: extract parenthesized strings from stream content if BT/ET found nothing
    if (textParts.length === 0) {
        const parenRegex = /\(([^)]{2,})\)/g;
        let parenMatch;
        while ((parenMatch = parenRegex.exec(content)) !== null) {
            const cleaned = decodePdfString(parenMatch[1]).trim();
            // Filter out non-text content (binary data, operators)
            if (cleaned.length > 1 && /[a-zA-ZåäöÅÄÖ0-9]/.test(cleaned) && !/^[\d.]+$/.test(cleaned)) {
                textParts.push(cleaned);
            }
        }
    }

    return textParts;
}

function decodePdfString(str: string): string {
    return str
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\\(/g, '(')
        .replace(/\\\)/g, ')')
        .replace(/\\\\/g, '\\')
        .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
}
