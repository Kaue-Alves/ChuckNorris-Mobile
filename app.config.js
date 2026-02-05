// Expo executa este arquivo em ambiente Node (CJS), então aqui pode usar dotenv.
require("dotenv").config();

module.exports = ({ config }) => ({
    ...config,
    extra: {
        ...(config.extra || {}),
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    },
});
