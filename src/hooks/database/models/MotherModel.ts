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
      (id, name, age, phone, address, husband_name, ethnicity, education, photo, is_synced, is_deleted, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      payload.id,
      payload.name ?? null,
      payload.age ?? null,
      payload.phone ?? null,
      payload.address ?? null,
      payload.husband_name ?? null,
      payload.ethnicity ?? null,
      payload.education ?? null,
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
    ethnicity: payload.ethnicity ?? null,
    education: payload.education ?? null,
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
    ethnicity: row.ethnicity ?? undefined,
    education: row.education ?? undefined,
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

export interface MotherListDbItem {
  id: string;
  name: string;
  nameNp: string;
  age: number;
  edd: string;
  lmp: string;
  anc: number;
  status: string;
  risk: string;
  ward: string;
  image: string;
}

export async function getAllMothersList(): Promise<MotherListDbItem[]> {
  const db = await getDb();
  
  const query = `
    SELECT 
      m.id,
      m.name,
      m.husband_name as nameNp,
      m.age,
      m.address as ward,
      m.photo as image,
      p.lmp_date as lmp,
      p.expected_delivery_date as edd
    FROM mother m
    LEFT JOIN pregnancy p ON p.id = (
      SELECT id FROM pregnancy 
      WHERE mother_id = m.id AND is_deleted = 0 
      ORDER BY created_at DESC LIMIT 1
    )
    WHERE m.is_deleted = 0
    ORDER BY m.created_at DESC
  `;

  const rows = await db.getAllAsync<any>(query);

  return rows.map((row) => ({
    id: row.id,
    name: row.name || "Unknown",
    nameNp: row.nameNp || "",
    age: row.age || 0,
    ward: row.ward || "Unknown Ward",
    image: row.image || "https://vectorified.com/images/no-profile-picture-icon-13.png",
    lmp: row.lmp || "N/A",
    edd: row.edd || "N/A",
    anc: 0,
    status: "active",
    risk: "low",
  }));
}

export interface MotherProfileDbItem extends MotherListDbItem {
  phone: string;
  regDate: string;
  pregnancyId: string | null;
  husbandName: string;
  ethnicity: string;
  education: string;
  gravida: string;
  parity: string;
}

export async function getMotherProfile(id: string): Promise<MotherProfileDbItem | null> {
  const db = await getDb();
  const query = `
    SELECT 
      m.id,
      m.name,
      m.husband_name as nameNp,
      m.husband_name as husbandName,
      m.ethnicity,
      m.education,
      m.age,
      m.phone,
      m.address as ward,
      m.photo as image,
      m.created_at as regDate,
      p.id as pregnancyId,
      p.lmp_date as lmp,
      p.expected_delivery_date as edd,
      p.gravida,
      p.parity
    FROM mother m
    LEFT JOIN pregnancy p ON p.id = (
      SELECT id FROM pregnancy 
      WHERE mother_id = m.id AND is_deleted = 0 
      ORDER BY created_at DESC LIMIT 1
    )
    WHERE m.id = ? AND m.is_deleted = 0
  `;
  const row = await db.getFirstAsync<any>(query, [id]);
  if (!row) return null;

  return {
    id: row.id,
    name: row.name || "Unknown",
    nameNp: row.nameNp || "",
    husbandName: row.husbandName || "",
    ethnicity: row.ethnicity || "",
    education: row.education || "",
    pregnancyId: row.pregnancyId || null,
    gravida: row.gravida !== null ? String(row.gravida) : "",
    parity: row.parity !== null ? String(row.parity) : "",
    age: row.age || 0,
    phone: row.phone || "",
    ward: row.ward || "Unknown Ward",
    image: row.image || "https://vectorified.com/images/no-profile-picture-icon-13.png",
    lmp: row.lmp || "",
    edd: row.edd || "N/A",
    anc: 0,
    status: "active",
    risk: "low",
    regDate: row.regDate || "N/A",
  };
}

export async function getMotherCount(): Promise<number> {
  const db = await getDb();
  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM mother WHERE is_deleted = 0"
  );
  return result?.count ?? 0;
}
