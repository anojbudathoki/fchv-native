import * as Crypto from "expo-crypto";
import { getDb } from "../db";

export interface ChildVaccinationStoreType {
    id: string;
    child_id: string;
    vaccine_id: string;
    is_given: number;
    given_date: string | null;
    is_synced: number;
    is_deleted: number;
    created_at: string;
    updated_at: string;
}

export async function getChildVaccinations(child_id: string): Promise<ChildVaccinationStoreType[]> {
    const db = await getDb();
    const results = await db.getAllAsync<ChildVaccinationStoreType>(
        "SELECT * FROM child_vaccination WHERE child_id = ? AND is_deleted = 0",
        [child_id]
    );
    return results;
}

export async function toggleVaccineStatus(
    child_id: string,
    vaccine_id: string,
    is_given: boolean,
    given_date?: string
): Promise<void> {
    const db = await getDb();
    const now = new Date().toISOString();

    const existing = await db.getFirstAsync<ChildVaccinationStoreType>(
        "SELECT id FROM child_vaccination WHERE child_id = ? AND vaccine_id = ?",
        [child_id, vaccine_id]
    );

    if (existing) {
        await db.runAsync(
            `UPDATE child_vaccination 
       SET is_given = ?, given_date = ?, updated_at = ?, is_synced = 0 
       WHERE id = ?`,
            [is_given ? 1 : 0, given_date || (is_given ? now : null), now, existing.id]
        );
    } else {
        const id = Crypto.randomUUID();
        await db.runAsync(
            `INSERT INTO child_vaccination (id, child_id, vaccine_id, is_given, given_date, created_at, updated_at, is_synced, is_deleted) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)`,
            [id, child_id, vaccine_id, is_given ? 1 : 0, given_date || (is_given ? now : null), now, now]
        );
    }
}
