import * as SQLite from "expo-sqlite";

export const SCHEMA_VERSION = 1;

type Migration = {
  version: number;
  up: (db: SQLite.SQLiteDatabase) => Promise<void>;
};

// async function addColumnIfMissing(
//   db: SQLite.SQLiteDatabase,
//   tableName: string,
//   columnName: string,
//   columnDefinition: string
// ): Promise<void> {
//   const rows = await db.getAllAsync<{ name: string }>(
//     `PRAGMA table_info(${tableName});`
//   );
//   const exists = rows.some((row) => row.name === columnName);
//   if (exists) return;

//   await db.execAsync(
//     `ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition};`
//   );
// }

export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    up: async (db) => {
      // await addColumnIfMissing(
      //   db,
      //   "calendar_events",
      //   "position",
      //   "position INTEGER DEFAULT 0"
      // );
      // await addColumnIfMissing(
      //   db,
      //   "calendar_events_staging",
      //   "position",
      //   "position INTEGER DEFAULT 0"
      // );
    }
  }
];
