import * as Crypto from "expo-crypto";
import { getCurrentNepaliMonth } from "../../../utils/dateHelper";
import { getDb } from "../db";

export interface CounselingReferralStoreType {
  id: string;
  mother_id: string;
  answers: string | null; // JSON string of question ID to boolean
  reg_month?: string | null;
  is_synced: number;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}

export async function getCounselingReferralByMother(
  mother_id: string,
): Promise<CounselingReferralStoreType | null> {
  const db = await getDb();
  const result = await db.getFirstAsync<CounselingReferralStoreType>(
    `SELECT * FROM counseling_referral WHERE mother_id = ? AND is_deleted = 0`,
    [mother_id],
  );
  return result || null;
}

export async function saveCounselingReferral(payload: {
  id?: string;
  mother_id: string;
  answers: string | null;
}): Promise<CounselingReferralStoreType> {
  const db = await getDb();
  const now = new Date().toISOString();
  const id = payload.id || Crypto.randomUUID();

  const existing = await getCounselingReferralByMother(payload.mother_id);

  if (existing) {
    await db.runAsync(
      `UPDATE counseling_referral 
       SET answers = ?, updated_at = ?, is_synced = 0 
       WHERE mother_id = ?`,
      [payload.answers ?? null, now, payload.mother_id],
    );
    return {
      ...existing,
      answers: payload.answers ?? null,
      updated_at: now
    };
  } else {
    await db.runAsync(
      `INSERT INTO counseling_referral (id, mother_id, answers, reg_month, created_at, updated_at, is_synced, is_deleted) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)`,
      [id, payload.mother_id, payload.answers ?? null, getCurrentNepaliMonth(), now, now],
    );
    return {
      id,
      mother_id: payload.mother_id,
      answers: payload.answers ?? null,
      reg_month: getCurrentNepaliMonth(),
      created_at: now,
      updated_at: now,
      is_synced: 0,
      is_deleted: 0,
    };
  }
}
