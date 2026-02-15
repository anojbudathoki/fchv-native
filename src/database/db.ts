// db/index.ts
import * as SQLite from "expo-sqlite";
import { SCHEMA_SQL } from "./schema";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Get the DB singleton (async open)
export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("myapp.db");
  }
  return dbPromise;
}

async function initSyncDefaultColumns(): Promise<void> {
  const db = await getDb();

  await db.runAsync(
    `INSERT OR IGNORE INTO sync (table_name, last_synced_at)
     VALUES (?, NULL), (?, NULL), (?, NULL), (?, NULL), (?, NULL), (?, NULL);`,
    [
      "symptom_logs",
      "vital_logs",
      "mood_logs",
      "calendar_events",
      "anc_visits",
      "kick_counter",
    ],
  );
}

// Initialization: Create tables if not exist (call once on app start)
export async function initDatabase(): Promise<void> {
  const db = await getDb();
  await db.execAsync(SCHEMA_SQL); // Executes all schema SQL at once
  await initSyncDefaultColumns();
}

export async function clearDatabase(): Promise<void> {
  const db = await getDb();

  const tables = await db.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != 'android_metadata'",
  );

  for (const table of tables) {
    await db.execAsync(`DELETE FROM ${table.name};`);
  }

  // Re-seed sync tracking so new sessions can sync without app restart.
  await initSyncDefaultColumns();

  console.log("ALL TABLE ERASED");
}
