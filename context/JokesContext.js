import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
    deleteSavedJoke,
    insertSavedJoke,
    listSavedJokes,
} from "../services/db";

const JokesContext = createContext(null);

function makeJokeId(englishText) {
    if (typeof englishText !== "string") return "";
    return englishText.trim();
}

export function JokesProvider({ children }) {
    const [savedJokes, setSavedJokes] = useState([]);

    useEffect(() => {
        let active = true;

        (async () => {
            try {
                const jokes = await listSavedJokes();
                if (active) setSavedJokes(jokes);
            } catch (err) {
                console.error("Falha ao carregar piadas do SQLite", err);
            }
        })();

        return () => {
            active = false;
        };
    }, []);

    const value = useMemo(() => {
        function isSaved(englishText) {
            const id = makeJokeId(englishText);
            if (!id) return false;
            return savedJokes.some((j) => j.id === id);
        }

        async function saveJoke({ englishText, translatedText }) {
            const id = makeJokeId(englishText);
            if (!id) return;

            if (savedJokes.some((j) => j.id === id)) return;

            const createdAt = Date.now();
            const next = {
                id,
                englishText: englishText.trim(),
                translatedText:
                    typeof translatedText === "string"
                        ? translatedText.trim()
                        : "",
                createdAt,
            };

            try {
                await insertSavedJoke(next);
                setSavedJokes((prev) => {
                    if (prev.some((j) => j.id === id)) return prev;
                    return [next, ...prev];
                });
            } catch (err) {
                console.error("Falha ao salvar piada no SQLite", err);
            }
        }

        async function deleteJoke(englishTextOrId) {
            const id = makeJokeId(englishTextOrId);
            if (!id) return;

            try {
                await deleteSavedJoke(id);
                setSavedJokes((prev) => prev.filter((j) => j.id !== id));
            } catch (err) {
                console.error("Falha ao excluir piada no SQLite", err);
            }
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
