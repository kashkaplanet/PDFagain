import { useState, useEffect, useCallback } from 'react';
// import * as fabric from 'fabric';
import { AnnotationSettings } from '../components/tools/annotation/AnnotationTypes';

interface UseAnnotationsProps {
    fabricRef: any; // React.MutableRefObject<fabric.Canvas | null>;
    saveToHistory: () => void;
    activeTool: string;
    onToolChange: (tool: string) => void;
}

export function useAnnotations({ fabricRef, saveToHistory, activeTool, onToolChange }: UseAnnotationsProps) {
    const [annotationSettings, setAnnotationSettings] = useState<AnnotationSettings>({
        color: '#ffff00',
        opacity: 0.4,
        thickness: 2
    });

    // Sticky Note State
    const [isStickyNoteModalOpen, setIsStickyNoteModalOpen] = useState(false);
    const [, setPendingStickyNotePos] = useState<{ x: number, y: number } | null>(null);

    // -------------------------------------------------------------------------
    // Event Handlers
    // -------------------------------------------------------------------------

    // Handle Sticky Note Placement
    const handleCanvasMouseDown = useCallback(() => {
        // if (activeTool !== 'sticky-note') return;
        // // Fabric logic disabled
    }, []);


    // Handle Text Selection for Highlight
    useEffect(() => {
        // Fabric logic disabled
    }, [activeTool, fabricRef, annotationSettings, saveToHistory]);


    // -------------------------------------------------------------------------
    // Actions
    // -------------------------------------------------------------------------

    const addStickyNote = () => {
        // Fabric logic disabled
        /*
        if (!fabricRef.current || !pendingStickyNotePos) return;

        const canvas = fabricRef.current;
        // ...
        */
        console.warn("Sticky notes are disabled temporarily.");
        setPendingStickyNotePos(null);
        onToolChange('select'); // Auto-switch back to select
    };

    return {
        annotationSettings,
        setAnnotationSettings,
        isStickyNoteModalOpen,
        setIsStickyNoteModalOpen,
        addStickyNote,
        handleCanvasMouseDown
    };
}
