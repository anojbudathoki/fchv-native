import * as SQLite from "expo-sqlite";

export const SCHEMA_VERSION = 2;

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
  }
];
