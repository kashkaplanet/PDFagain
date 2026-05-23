
// import * as fabric from 'fabric';

export type AnnotationTool = 'highlight' | 'sticky-note' | 'underline' | 'strikethrough';

export interface AnnotationSettings {
    color: string;
    opacity: number;
    thickness?: number;
}

export interface StickyNoteData {
    text: string;
    author?: string;
    date?: string;
}

// Fabric object interface extensions
export interface FabricObjectWithData { // extends fabric.FabricObject {
    [key: string]: any;
    data?: {
        type: string;
        [key: string]: any;
    };
}
