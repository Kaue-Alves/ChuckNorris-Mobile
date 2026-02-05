import * as SQLite from "expo-sqlite";

const DB_NAME = "chuck-jokes.db";
const TABLE_NAME = "saved_jokes";

let dbPromise;
let initPromise;

async function getDb() {
    if (!dbPromise) {
        dbPromise = SQLite.openDatabaseAsync(DB_NAME);
    }
    return dbPromise;
}

export async function ensureDbInitialized() {
    if (initPromise) return initPromise;

    initPromise = (async () => {
        const db = await getDb();

        await db.execAsync(`
            PRAGMA journal_mode = WAL;

            CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
                id TEXT PRIMARY KEY NOT NULL,
                englishText TEXT NOT NULL,
                translatedText TEXT NOT NULL,
                createdAt INTEGER NOT NULL
            );
        `);

        return db;
    })();

    return initPromise;
}

export async function listSavedJokes() {
    const db = await ensureDbInitialized();
    const rows = await db.getAllAsync(
        `SELECT id, englishText, translatedText, createdAt
         FROM ${TABLE_NAME}
         ORDER BY createdAt DESC`,
    );

    return rows.map((r) => ({
        id: r.id,
        englishText: r.englishText,
        translatedText: r.translatedText,
        createdAt: r.createdAt,
    }));
}

export async function insertSavedJoke({
    id,
    englishText,
    translatedText,
    createdAt,
}) {
    const db = await ensureDbInitialized();

    await db.runAsync(
        `INSERT OR IGNORE INTO ${TABLE_NAME} (id, englishText, translatedText, createdAt)
         VALUES (?, ?, ?, ?)`,
        [id, englishText, translatedText, createdAt],
    );
}

export async function deleteSavedJoke(id) {
    const db = await ensureDbInitialized();
    await db.runAsync(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]);
}
