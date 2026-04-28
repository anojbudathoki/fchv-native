import * as SQLite from "expo-sqlite";

export const SCHEMA_VERSION = 12;

type Migration = {
  version: number;
  up: (db: SQLite.SQLiteDatabase) => Promise<void>;
};

export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    up: async (db) => { }
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
  },
  {
    version: 6,
    up: async (db) => {
      try {
        await db.execAsync(`
          ALTER TABLE mother ADD COLUMN code TEXT;
        `);
      } catch (e) {
        console.log("Migration 6 (code column) already applied or failed:", e);
      }
      try {
        await db.execAsync(`
          ALTER TABLE pregnancy ADD COLUMN mother_id TEXT;
        `);
      } catch (e) {
        console.log("Migration 6 (mother_id column) already applied or failed:", e);
      }
    }
  },
  {
    version: 7,
    up: async (db) => {
      try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS hmis_record (
            id TEXT PRIMARY KEY,
            serial_no INTEGER,
            date_day INTEGER,
            date_month INTEGER,
            date_year INTEGER,
            mother_name TEXT,
            mother_age INTEGER,
            lmp_day INTEGER,
            lmp_month INTEGER,
            lmp_year INTEGER,
            edd_day INTEGER,
            edd_month INTEGER,
            edd_year INTEGER,
            counseling_given INTEGER,
            checkup_12 INTEGER,
            checkup_16 INTEGER,
            checkup_20_24 INTEGER,
            checkup_28 INTEGER,
            checkup_32 INTEGER,
            checkup_34 INTEGER,
            checkup_36 INTEGER,
            checkup_38_40 INTEGER,
            checkup_other TEXT,
            iron_preg_received INTEGER,
            iron_pnc_received INTEGER,
            vit_a_received INTEGER,
            delivery_place TEXT,
            newborn_condition TEXT,
            pnc_check_24hr INTEGER,
            pnc_check_3day INTEGER,
            pnc_check_7_14day INTEGER,
            pnc_check_42day INTEGER,
            pnc_check_other TEXT,
            family_planning_used INTEGER,
            remarks TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );
        `);
      } catch (e) {
        console.log("Migration 7 (hmis_record table) failed:", e);
      }
    }
  },
  {
    version: 8,
    up: async (db) => {
      try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS hmis_maternal_death (
            id TEXT PRIMARY KEY,
            mother_id TEXT,
            serial_no INTEGER,
            mother_name TEXT,
            mother_age INTEGER,
            death_condition TEXT,
            death_day INTEGER,
            death_month INTEGER,
            death_year INTEGER,
            delivery_place TEXT,
            death_place TEXT,
            remarks TEXT,
            is_synced INTEGER NOT NULL DEFAULT 0,
            is_deleted INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(mother_id) REFERENCES mother(id)
          );
        `);
      } catch (e) {
        console.log("Migration 8 (hmis_maternal_death table) failed:", e);
      }
    }
  },
  {
    version: 9,
    up: async (db) => {
      const queries = [
        "ALTER TABLE hmis_maternal_death ADD COLUMN death_condition_other TEXT;",
        "ALTER TABLE hmis_maternal_death ADD COLUMN delivery_place_other TEXT;",
        "ALTER TABLE hmis_maternal_death ADD COLUMN death_place_other TEXT;",
        "ALTER TABLE hmis_newborn_death ADD COLUMN delivery_place_other TEXT;",
        "ALTER TABLE hmis_newborn_death ADD COLUMN birth_condition_other TEXT;",
        "ALTER TABLE hmis_newborn_death ADD COLUMN cause_of_death_other TEXT;",
        "ALTER TABLE hmis_newborn_death ADD COLUMN death_place_other TEXT;"
      ];
      for (const query of queries) {
        try {
          await db.execAsync(query);
        } catch (e) {
          console.log(`Migration 9 query failed or already applied: ${query}`, e);
        }
      }
    }
  },
  {
    version: 10,
    up: async (db) => {
      try {
        await db.execAsync(`ALTER TABLE hmis_newborn_death ADD COLUMN baby_name TEXT;`);
      } catch (e) {
        console.log("Migration 10 (baby_name column) already applied or failed:", e);
      }
    }
  },
  {
    version: 11,
    up: async (db) => {
      try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS hmis_child_death (
            id TEXT PRIMARY KEY,
            mother_id TEXT,
            mother_name TEXT,
            child_name TEXT,
            birth_day INTEGER,
            birth_month INTEGER,
            birth_year INTEGER,
            death_age_months INTEGER,
            cause_of_death TEXT,
            remarks TEXT,
            is_synced INTEGER NOT NULL DEFAULT 0,
            is_deleted INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(mother_id) REFERENCES mother(id)
          );
        `);
      } catch (e) {
        console.log("Migration 11 (hmis_child_death table) failed:", e);
      }
    }
  },
  {
    version: 12,
    up: async (db) => {
      try {
        await db.execAsync(`ALTER TABLE hmis_newborn_death ADD COLUMN gender TEXT;`);
      } catch (e) {
        console.log("Migration 12 (gender newborn) failed:", e);
      }
      try {
        await db.execAsync(`ALTER TABLE hmis_child_death ADD COLUMN gender TEXT;`);
      } catch (e) {
        console.log("Migration 12 (gender child) failed:", e);
      }
    }
  }
];
