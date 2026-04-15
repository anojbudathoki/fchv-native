export const SCHEMA_SQL = `
 PRAGMA journal_mode = WAL; -- Improves performance/concurrency

CREATE TABLE IF NOT EXISTS pregnancy (
    id TEXT PRIMARY KEY,
    is_synced INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    name TEXT,
    lmp_date TEXT NOT NULL,
    caretakers_name TEXT,
    caretakers_phone TEXT,
    expected_delivery_date TEXT,
    parity INTEGER,
    is_current INTEGER NOT NULL DEFAULT 0,
    selected INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

CREATE TABLE IF NOT EXISTS sync (
    table_name TEXT PRIMARY KEY,
    last_synced_at TEXT
);

`;
