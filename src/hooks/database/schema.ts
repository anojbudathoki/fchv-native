export const SCHEMA_SQL = `
 PRAGMA journal_mode = WAL; -- Improves performance/concurrency

CREATE TABLE IF NOT EXISTS mother(
    id TEXT PRIMARY KEY,
    code TEXT,
    is_synced INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    name TEXT,
    age INTEGER,
    phone TEXT,
    address TEXT,
    husband_name TEXT,
    ethnicity TEXT,
    education TEXT,
    photo TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS pregnancy (
    id TEXT PRIMARY KEY,
    mother_id TEXT,
    is_synced INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    gravida INTEGER,
    parity INTEGER,
    lmp_date TEXT NOT NULL,
    expected_delivery_date TEXT,
    is_current INTEGER NOT NULL DEFAULT 0,
    selected INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

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

CREATE TABLE IF NOT EXISTS sync (
    table_name TEXT PRIMARY KEY,
    last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS todo (
    id TEXT PRIMARY KEY,
    task TEXT NOT NULL,
    is_completed INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

`;
