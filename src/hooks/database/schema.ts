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

CREATE TABLE IF NOT EXISTS hmis_maternal_death (
    id TEXT PRIMARY KEY,
    mother_id TEXT,
    serial_no INTEGER,
    mother_name TEXT,
    mother_age INTEGER,
    death_condition TEXT, -- 'Pregnant', 'Labor', 'Post-delivery', 'Other'
    death_condition_other TEXT,
    death_day INTEGER,
    death_month INTEGER,
    death_year INTEGER,
    delivery_place TEXT, -- 'Home', 'Institution', 'Other'
    delivery_place_other TEXT,
    death_place TEXT, -- 'Home', 'Institution', 'Other'
    death_place_other TEXT,
    remarks TEXT,
    is_synced INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(mother_id) REFERENCES mother(id)
);

CREATE TABLE IF NOT EXISTS hmis_newborn_death (
    id TEXT PRIMARY KEY,
    mother_id TEXT,
    mother_name TEXT,
    baby_name TEXT,
    birth_day INTEGER,
    birth_month INTEGER,
    birth_year INTEGER,
    delivery_place TEXT, -- 'Home', 'Institution', 'Other'
    delivery_place_other TEXT,
    birth_condition TEXT, -- 'Preterm', 'LowWeight', 'Normal', 'Other'
    birth_condition_other TEXT,
    death_age_days INTEGER,
    cause_of_death TEXT, -- 'Asphyxia', 'Hypothermia', 'Infection', 'Other'
    cause_of_death_other TEXT,
    death_place TEXT, -- 'Home', 'Institution', 'Other'
    death_place_other TEXT,
    gender TEXT, -- 'Male', 'Female'
    remarks TEXT,
    is_synced INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(mother_id) REFERENCES mother(id)
);

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
    gender TEXT, -- 'Male', 'Female'
    remarks TEXT,
    is_synced INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(mother_id) REFERENCES mother(id)
);
`;
