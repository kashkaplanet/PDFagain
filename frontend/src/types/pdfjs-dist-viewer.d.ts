declare module 'pdfjs-dist/web/pdf_viewer.mjs' {
    export class TextLayerBuilder {
        div: HTMLDivElement;
        constructor(options: {
            pdfPage: any;
            highlighter?: any;
            accessibilityManager?: any;
            isOffscreenCanvasSupported?: boolean;
        });
        render(viewport: any): Promise<void>;
        cancel(): void;
    }
}
