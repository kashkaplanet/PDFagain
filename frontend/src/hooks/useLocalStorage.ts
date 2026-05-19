import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
    // State to store our value
    // Initialize with initialValue to ensure server/client match
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    // One-time effect to read from local storage after mount
    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            console.error(error);
        }
    }, [key]);

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.error(error);
        }
    };

    return [storedValue, setValue] as const;
}
