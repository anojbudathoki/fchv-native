import { getDb } from '../db';
import { CreateMotherPayload, MotherStoreType } from '../types/motherModal';

export async function createMother(
  payload: Omit<CreateMotherPayload, 'created_at' | 'updated_at'>
): Promise<MotherStoreType> {
  console.log("Creating mother", payload);
  const db = await getDb();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT OR REPLACE INTO mother 
      (id, name, age, phone, address, husband_name, photo, is_synced, is_deleted, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      payload.id,
      payload.name ?? null,
      payload.age ?? null,
      payload.phone ?? null,
      payload.address ?? null,
      payload.husband_name ?? null,
      payload.photo ?? null,
      payload.is_synced ? 1 : 0,
      0,
      now,
      now
    ]
  );

  return {
    id: payload.id,
    name: payload.name ?? null,
    age: payload.age ?? null,
    phone: payload.phone ?? null,
    address: payload.address ?? null,
    husband_name: payload.husband_name ?? null,
    photo: payload.photo ?? null,
    is_synced: payload.is_synced ? 1 : 0,
    is_deleted: 0,
    created_at: now,
    updated_at: now
  };
}

export async function unSyncedMothers(): Promise<CreateMotherPayload[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<MotherStoreType>(
    `SELECT * FROM mother WHERE is_synced = 0 AND is_deleted = 0`
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name ?? undefined,
    age: row.age ?? undefined,
    phone: row.phone ?? undefined,
    address: row.address ?? undefined,
    husband_name: row.husband_name ?? undefined,
    photo: row.photo ?? undefined,
    is_synced: false
  }));
}

export async function deleteMother(id: string): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.runAsync(
    `UPDATE mother SET is_deleted = 1, updated_at = ? WHERE id = ?`,
    [now, id]
  );
}
