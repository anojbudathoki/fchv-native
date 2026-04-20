import * as SQLite from "expo-sqlite";

export const SCHEMA_VERSION = 5;

type Migration = {
  version: number;
  up: (db: SQLite.SQLiteDatabase) => Promise<void>;
};

export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    up: async (db) => {}
  },
  {
    version: 2,
    up: async (db) => {
      // Force table refresh for the new schema since development db may have dirty state
      await db.execAsync(`
        DROP TABLE IF EXISTS pregnancy;
        DROP TABLE IF EXISTS mother;
        DROP TABLE IF EXISTS sync;
      `);
      
      const { SCHEMA_SQL } = require('./schema');
      await db.execAsync(SCHEMA_SQL);
    }
  },
  {
    version: 3,
    up: async (db) => {
      try {
        await db.execAsync(`ALTER TABLE mother ADD COLUMN photo TEXT;`);
      } catch (e) {
        console.log("Migration 3 (photo column) already applied or failed:", e);
      }
    }
  },
  {
    version: 4,
    up: async (db) => {
      try {
        await db.execAsync(`
          ALTER TABLE mother ADD COLUMN ethnicity TEXT;
          ALTER TABLE mother ADD COLUMN education TEXT;
        `);
      } catch (e) {
        console.log("Migration 4 failed or columns already exist:", e);
      }
    }
  },
  {
    version: 5,
    up: async (db) => {
      try {
        await db.execAsync(`
          DROP TABLE IF EXISTS visit;
          CREATE TABLE IF NOT EXISTS visit (
            id TEXT PRIMARY KEY,
            mother_id TEXT NOT NULL,
            name TEXT,
            address TEXT,
            is_synced INTEGER NOT NULL DEFAULT 0,
            is_deleted INTEGER NOT NULL DEFAULT 0,
            visit_date TEXT NOT NULL,
            visit_type TEXT NOT NULL CHECK(visit_type IN ('ANC', 'PNC')),
            visit_notes TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(mother_id) REFERENCES mother(id)
          );
        `);
      } catch (e) {
        console.log("Migration 5 (visit table) failed:", e);
      }
    }
  }
];
