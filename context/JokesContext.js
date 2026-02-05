import { createContext, useContext, useMemo, useState } from "react";

const JokesContext = createContext(null);

function makeJokeId(englishText) {
    if (typeof englishText !== "string") return "";
    return englishText.trim();
}

export function JokesProvider({ children }) {
    const [savedJokes, setSavedJokes] = useState([]);

    const value = useMemo(() => {
        function isSaved(englishText) {
            const id = makeJokeId(englishText);
            if (!id) return false;
            return savedJokes.some((j) => j.id === id);
        }

        function saveJoke({ englishText, translatedText }) {
            const id = makeJokeId(englishText);
            if (!id) return;

            setSavedJokes((prev) => {
                if (prev.some((j) => j.id === id)) return prev;
                return [
                    {
                        id,
                        englishText: englishText.trim(),
                        translatedText:
                            typeof translatedText === "string"
                                ? translatedText.trim()
                                : "",
                        createdAt: Date.now(),
                    },
                    ...prev,
                ];
            });
        }

        function deleteJoke(englishTextOrId) {
            const id = makeJokeId(englishTextOrId);
            if (!id) return;
            setSavedJokes((prev) => prev.filter((j) => j.id !== id));
        }

        return {
            savedJokes,
            isSaved,
            saveJoke,
            deleteJoke,
        };
    }, [savedJokes]);

    return (
        <JokesContext.Provider value={value}>{children}</JokesContext.Provider>
    );
}

export function useJokes() {
    const ctx = useContext(JokesContext);
    if (!ctx) {
        throw new Error("useJokes deve ser usado dentro de JokesProvider");
    }
    return ctx;
}
