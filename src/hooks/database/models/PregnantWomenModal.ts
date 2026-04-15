import { getDb } from '../db';
import * as Crypto from "expo-crypto";
import { bulkInsertToTempTable } from './CommonModal';
import { setSyncTimestamp } from './SyncModel';
import { CreatePregnancyPayload, PregnancyStoreType } from '../types/pregnancyModal';

  
export async function createPregnancy(
  payload: Omit<CreatePregnancyPayload, 'id' | 'created_at' | 'updated_at'>
): Promise<PregnancyStoreType> {
  const db = await getDb();
  const now = new Date().toISOString();
  const id = Crypto.randomUUID();

  await db.runAsync(
    `INSERT OR REPLACE INTO pregnancy 
      (id, name, lmp_date, caretakers_name, caretakers_phone, expected_delivery_date, is_current, parity, selected, is_synced, is_deleted, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      payload.name ?? null,
      payload.lmp_date,
      payload.caretakers_name ?? null,
      payload.caretakers_phone ?? null,
      payload.expected_delivery_date ?? null,
      payload.is_current ? 1 : 0,
      payload.parity ?? null,
      payload.selected ? 1 : 0,
      payload.is_synced ? 1 : 0,
      0,
      now,
      now
    ]
  );

  return {
    id: id,
    name: payload.name ?? null,
    lmp_date: payload.lmp_date,
    caretakers_name: payload.caretakers_name ?? null,
    caretakers_phone: payload.caretakers_phone ?? null,
    expected_delivery_date: payload.expected_delivery_date ?? null,
    is_current: payload.is_current ? 1 : 0,
    parity: payload.parity ?? null,
    selected: payload.selected ? 1 : 0,
    is_synced: payload.is_synced ? 1 : 0,
    is_deleted: 0,
    created_at: now,
    updated_at: now
  };
}

 export async function unSyncedPregnancies(): Promise<CreatePregnancyPayload[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<PregnancyStoreType>(
    `SELECT * FROM pregnancy WHERE is_synced = 0 AND is_deleted = 0`
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name ?? undefined,
    lmp_date: row.lmp_date,
    caretakers_name: row.caretakers_name ?? undefined,
    caretakers_phone: row.caretakers_phone ?? undefined,
    expected_delivery_date: row.expected_delivery_date ?? undefined,
    is_current: row.is_current === 1,
    parity: row.parity ?? undefined,
    selected: row.selected === 1
  }));
}

export async function deletePregnancy(id: string): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.runAsync(
    `UPDATE pregnancy SET is_deleted = 1, updated_at = ? WHERE id = ?`,
    [now, id]
  );
}

export async function insertToTempPregnancyTable(
  apiRes: any[]
) {
  if (!apiRes.length) return;
  const db = await getDb();

  const columns = [
    "id",
    "name",
    "lmp_date",
    "caretakers_name",
    "caretakers_phone",
    "expected_delivery_date",
    "is_current",
    "parity",
    "selected",
    "is_synced",
    "is_deleted",
    "created_at",
    "updated_at"
  ];

  await bulkInsertToTempTable<any>(
    {
      db,
      table: "pregnancy_staging",
      columns,
      onConflict: "replace",
      rows: (item: any) => [
        item.id,
        item.name ?? null,
        item.lmp_date,
        item.caretakers_name ?? null,
        item.caretakers_phone ?? null,
        item.expected_delivery_date ?? null,
        item.is_current ? 1 : 0,
        item.parity ?? 0,
        item.selected ? 1 : 0,
        1,
        item.deleted ? 1 : 0,
        item.created_at,
        item.updated_at
      ]
    },
    apiRes
  );
}

export async function moveTempToRealPregnancyTable() {
  const db = await getDb();

  const staged = await db.getAllAsync<any>(
    `SELECT * FROM pregnancy_staging`
  );

  if (!staged.length) return;

  for (const item of staged) {
    await db.runAsync(
      `
      INSERT INTO pregnancy
        (id, name, lmp_date, caretakers_name, caretakers_phone, expected_delivery_date, is_current, parity, selected, is_synced, is_deleted, created_at, updated_at)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        lmp_date = excluded.lmp_date,
        caretakers_name = excluded.caretakers_name,
        caretakers_phone = excluded.caretakers_phone,
        expected_delivery_date = excluded.expected_delivery_date,
        is_current = excluded.is_current,
        parity = excluded.parity,
        selected = excluded.selected,
        created_at = excluded.created_at,
        updated_at = excluded.updated_at,
        is_synced = excluded.is_synced,
        is_deleted = excluded.is_deleted
      WHERE datetime(excluded.updated_at) > datetime(pregnancy.updated_at)
         OR pregnancy.updated_at IS NULL;
      `,
      [
        item.id,
        item.name,
        item.lmp_date,
        item.caretakers_name,
        item.caretakers_phone,
        item.expected_delivery_date,
        item.is_current,
        item.parity,
        item.selected,
        1,
        item.is_deleted,
        item.created_at,
        item.updated_at
      ]
    );
  }

  const now = new Date().toISOString();
  await setSyncTimestamp("pregnancy", now);
}

export async function getSelectedPregnancy(): Promise<PregnancyStoreType | null> {
  const db = await getDb();
  return await db.getFirstAsync<PregnancyStoreType>(
    `SELECT * FROM pregnancy WHERE selected = 1 AND is_deleted = 0`
  );
}

