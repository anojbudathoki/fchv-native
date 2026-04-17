// db/index.ts
import * as SQLite from "expo-sqlite";
import { SCHEMA_SQL } from "./schema";
import { MIGRATIONS, SCHEMA_VERSION } from "./migrations";

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
     VALUES (?, NULL), (?, NULL);`,
    [
      "pregnancy",
      "pregnant_women",
    ],
  );
}
                                                                                                         

async function getUserVersion(
  db: SQLite.SQLiteDatabase
): Promise<number> {
  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version;"
  );
  return row?.user_version ?? 0;
}

async function setUserVersion(
  db: SQLite.SQLiteDatabase,
  version: number
): Promise<void> {
  await db.execAsync(`PRAGMA user_version = ${version};`);
}


async function hasAnyUserTables(db: SQLite.SQLiteDatabase): Promise<boolean> {
  const row = await db.getFirstAsync<{ count: number }>(
    "SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != 'android_metadata'"
  );
  return (row?.count ?? 0) > 0;
}

async function applyMigrations(
  db: SQLite.SQLiteDatabase,
  fromVersion: number
): Promise<number> {
  const pending = [...MIGRATIONS]
    .sort((a, b) => a.version - b.version)
    .filter((m) => m.version > fromVersion);

  let currentVersion = fromVersion;
  for (const migration of pending) {
    await db.withTransactionAsync(async () => {
      await migration.up(db);
      await setUserVersion(db, migration.version);
    });
    currentVersion = migration.version;
  }

  return currentVersion;
}

export async function initDatabase(): Promise<void> {
  const db = await getDb();

  const hadTables = await hasAnyUserTables(db);
  await db.execAsync(SCHEMA_SQL); // Executes all schema SQL at once

  let userVersion = await getUserVersion(db);
  if (userVersion === 0) {
    if (hadTables) {
      userVersion = await applyMigrations(db, 0);
    } else {
      await setUserVersion(db, SCHEMA_VERSION);
      userVersion = SCHEMA_VERSION;
    }
  }

  if (userVersion < SCHEMA_VERSION) {
    await applyMigrations(db, userVersion);
  }

  await initSyncDefaultColumns();
}

export async function clearDatabase(): Promise<void> {
  const db = await getDb();

  const tables = await db.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != 'android_metadata'"
  );

  for (const table of tables) {
    await db.execAsync(`DELETE FROM ${table.name};`);
  }

  // Re-seed sync tracking so new sessions can sync without app restart.
  await initSyncDefaultColumns();

  console.log("ALL TABLE ERASED");
}
