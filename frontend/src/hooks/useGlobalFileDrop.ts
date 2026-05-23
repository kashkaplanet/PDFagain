import { useEffect } from "react";
import { useFileContext } from "@/context/FileContext";

interface UseGlobalFileDropProps {
    onFilesSelected: (files: File[]) => void;
    accept?: Record<string, string[]>;
    disabled?: boolean;
}

export function useGlobalFileDrop({
    onFilesSelected,
    accept = { "application/pdf": [".pdf"] },
    disabled = false,
}: UseGlobalFileDropProps) {
    const { files: globalFiles, clearFiles } = useFileContext();

    useEffect(() => {
        if (disabled || globalFiles.length === 0) return;

        // Check if ANY of the dropped files are accepted by this uploader
        const acceptedMimeTypes = Object.keys(accept);
        const acceptedExtensions = Object.values(accept).flat();

        const relevantFiles = globalFiles.filter((file) => {
            // If no strict accept, take all
            if (acceptedMimeTypes.length === 0 && acceptedExtensions.length === 0) return true;

            const ext = "." + file.name.split(".").pop()?.toLowerCase();
            const mimeType = file.type;

            const isExtensionValid = acceptedExtensions.includes(ext);
            const isMimeTypeValid = acceptedMimeTypes.includes(mimeType);

            return isExtensionValid || isMimeTypeValid;
        });

        if (relevantFiles.length > 0) {
            onFilesSelected(relevantFiles);
            // Clear global files so other components don't re-process them
            clearFiles();
        }
    }, [globalFiles, accept, onFilesSelected, clearFiles, disabled]);
}
