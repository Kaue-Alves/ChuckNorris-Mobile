import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import Constants from "expo-constants";

function getGoogleApiKey() {
    // Expo (dev & build) expõe "extra" via app.config.js / app.json
    const key = Constants.expoConfig?.extra?.GOOGLE_API_KEY;
    return typeof key === "string" && key.trim().length > 0 ? key : undefined;
}

export class Api {
    async getChuckJoke() {
        const response = await axios.get(
            "https://api.chucknorris.io/jokes/random",
        );
        console.log(response.data.value);
        return response.data.value;
    }

    async translateWithAI(jokeEnglish) {
        const apiKey = getGoogleApiKey();
        if (!apiKey) {
            throw new Error(
                "GOOGLE_API_KEY não configurada. Defina em .env e exponha via app.config.js (expo.extra).",
            );
        }

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents:
                "Traduza a seguinte piada para o português: " +
                jokeEnglish +
                "Caso ela seja de teor maior que 18 anos, por favor exiba apenas (a piada era demais para o horário) sem os parenteses. O formato final de resposta deve ser apenas o texto traduzido caso não tenha esse teor",
        });

        return response.text;
    }
}
