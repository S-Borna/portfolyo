'use client';

import React, { useState } from 'react';
import { Icons } from '@/components/ui';

const { Download, Loader2 } = Icons;

// ============================================
// PDF EXPORT COMPONENT
// Uses browser's print-to-PDF functionality
// ============================================

interface PDFExportButtonProps {
    cvId: string;
    cvName?: string;
    className?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
}

export function PDFExportButton({
    cvId,
    cvName = 'CV',
    className = '',
    variant = 'primary',
}: PDFExportButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleExport = async () => {
        setIsLoading(true);

        try {
            // Open CV in new window for printing
            const printWindow = window.open(
                `/api/cv/${cvId}/export`,
                '_blank',
                'width=800,height=1000'
            );

            if (printWindow) {
                // Wait for the page to load, then trigger print
                printWindow.onload = () => {
                    setTimeout(() => {
                        printWindow.print();
                    }, 500);
                };
            }
        } catch (error) {
            console.error('PDF export error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const baseClasses = 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50';

    const variantClasses = {
        primary: 'bg-white text-black hover:bg-zinc-200',
        secondary: 'bg-zinc-800 text-white hover:bg-zinc-700',
        ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800',
    };

    return (
        <button
            onClick={handleExport}
            disabled={isLoading}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            aria-label={`Ladda ner ${cvName} som PDF`}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Download className="w-4 h-4" />
            )}
            <span>Ladda ner PDF</span>
        </button>
    );
}

// ============================================
// ALTERNATIVE: Direct HTML-to-PDF
// For when browser print isn't suitable
// ============================================

interface DirectPDFExportProps {
    html: string;
    filename?: string;
    onComplete?: () => void;
    onError?: (error: Error) => void;
}

/**
 * Export HTML directly to PDF using an iframe
 * This method preserves styling better than window.print()
 */
export function exportHTMLToPDF({
    html,
    filename = 'cv',
    onComplete,
    onError,
}: DirectPDFExportProps): void {
    try {
        // Create a hidden iframe
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        iframe.style.left = '-9999px';

        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) throw new Error('Could not access iframe document');

        // Write the HTML
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();

        // Wait for styles and fonts to load
        setTimeout(() => {
            try {
                iframe.contentWindow?.print();

                // Cleanup after print dialog closes
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    onComplete?.();
                }, 1000);
            } catch (printError) {
                document.body.removeChild(iframe);
                onError?.(printError as Error);
            }
        }, 500);

    } catch (error) {
        onError?.(error as Error);
    }
}

// ============================================
// INLINE CV PREVIEW WITH DOWNLOAD
// ============================================

interface CVPreviewWithDownloadProps {
    cvId: string;
    cvName: string;
    templateId: string;
}

export function CVPreviewWithDownload({
    cvId,
    cvName,
    templateId,
}: CVPreviewWithDownloadProps) {
    return (
        <div className="relative group">
            {/* Preview iframe */}
            <div className="aspect-[210/297] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
                <iframe
                    src={`/api/cv-preview?id=${cvId}&template=${templateId}`}
                    className="w-full h-full pointer-events-none"
                    title={`Förhandsvisning av ${cvName}`}
                />
            </div>

            {/* Overlay with download button */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                <PDFExportButton cvId={cvId} cvName={cvName} variant="primary" />
            </div>
        </div>
    );
}
