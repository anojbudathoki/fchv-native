import { getDb } from "../db";
import { ChildDeathStoreType } from "../types/childDeathModal";

export async function createChildDeath(data: Partial<ChildDeathStoreType>): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  
  await db.runAsync(
    `INSERT INTO hmis_child_death (
      id, mother_id, mother_name, child_name, birth_day, birth_month, birth_year,
      death_age_months, cause_of_death, gender, remarks, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.id!,
      data.mother_id!,
      data.mother_name!,
      data.child_name || '',
      data.birth_day || 0,
      data.birth_month || 0,
      data.birth_year || 0,
      data.death_age_months || 0,
      data.cause_of_death || '',
      data.gender || '',
      data.remarks || '',
      now,
      now
    ]
  );
}

export async function getAllChildDeaths(): Promise<ChildDeathStoreType[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<ChildDeathStoreType>(
    `SELECT * FROM hmis_child_death ORDER BY created_at DESC`
  );
  return rows;
}

export async function getChildDeathByMother(motherId: string): Promise<ChildDeathStoreType | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<ChildDeathStoreType>(
    `SELECT * FROM hmis_child_death WHERE mother_id = ?`,
    [motherId]
  );
  return row;
}

export async function getTotalChildDeaths(): Promise<number> {
  const db = await getDb();
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM hmis_child_death`
  );
  return result?.count || 0;
}

export async function deleteChildDeath(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM hmis_child_death WHERE id = ?`, [id]);
}
