// Expo executa este arquivo em ambiente Node (CJS), então aqui pode usar dotenv.
require("dotenv").config();

module.exports = ({ config }) => ({
    ...config,
    plugins: Array.from(new Set([...(config.plugins || []), "expo-sqlite"])),
    extra: {
        ...(config.extra || {}),
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    },
});
