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
          ALTER TABLE mother ADD COLUMN code TEXT;
        `);
      } catch (e) {
        console.log("Migration 5 failed or columns already exist:", e);
      }
    }
  }
];
