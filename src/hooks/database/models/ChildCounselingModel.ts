import * as Crypto from "expo-crypto";
import { getCurrentNepaliMonth } from "../../../utils/dateHelper";
import { getDb } from "../db";

export interface ChildCounselingStoreType {
  id: string;
  child_id: string;
  answers: string | null; // JSON string of question ID to boolean
  reg_month?: string | null;
  is_synced: number;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}

export async function getChildCounselingByChild(
  child_id: string,
): Promise<ChildCounselingStoreType | null> {
  const db = await getDb();
  const result = await db.getFirstAsync<ChildCounselingStoreType>(
    `SELECT * FROM child_counseling WHERE child_id = ? AND is_deleted = 0`,
    [child_id],
  );
  return result || null;
}

export async function saveChildCounseling(payload: {
  id?: string;
  child_id: string;
  answers: string | null;
}): Promise<ChildCounselingStoreType> {
  const db = await getDb();
  const now = new Date().toISOString();
  const id = payload.id || Crypto.randomUUID();

  const existing = await getChildCounselingByChild(payload.child_id);

  if (existing) {
    await db.runAsync(
      `UPDATE child_counseling 
       SET answers = ?, updated_at = ?, is_synced = 0 
       WHERE child_id = ? AND is_deleted = 0`,
      [payload.answers ?? null, now, payload.child_id],
    );
    return {
      ...existing,
      answers: payload.answers ?? null,
      updated_at: now,
    };
  } else {
    await db.runAsync(
      `INSERT INTO child_counseling (id, child_id, answers, reg_month, created_at, updated_at, is_synced, is_deleted) 
       VALUES (?, ?, ?, ?, ?, ?, 0, 0)`,
      [id, payload.child_id, payload.answers ?? null, getCurrentNepaliMonth(), now, now],
    );
    return {
      id,
      child_id: payload.child_id,
      answers: payload.answers ?? null,
      reg_month: getCurrentNepaliMonth(),
      created_at: now,
      updated_at: now,
      is_synced: 0,
      is_deleted: 0,
    };
  }
}
