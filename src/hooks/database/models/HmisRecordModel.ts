import { getDb } from '../db';
import { CreateHmisRecordPayload, HmisRecordStoreType } from '../types/hmisRecordModal';

export async function createHmisRecord(
  payload: CreateHmisRecordPayload
): Promise<HmisRecordStoreType> {
  const db = await getDb();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO hmis_record 
      (id, serial_no, date_day, date_month, date_year, mother_name, mother_age, 
       lmp_day, lmp_month, lmp_year, edd_day, edd_month, edd_year, 
       counseling_given, checkup_12, checkup_16, checkup_20_24, checkup_28, 
       checkup_32, checkup_34, checkup_36, checkup_38_40, checkup_other, 
       iron_preg_received, iron_pnc_received, vit_a_received, delivery_place, 
       newborn_condition, pnc_check_24hr, pnc_check_3day, pnc_check_7_14day, 
       pnc_check_42day, pnc_check_other, family_planning_used, remarks, 
       created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      serial_no = excluded.serial_no,
      date_day = excluded.date_day,
      date_month = excluded.date_month,
      date_year = excluded.date_year,
      mother_name = excluded.mother_name,
      mother_age = excluded.mother_age,
      lmp_day = excluded.lmp_day,
      lmp_month = excluded.lmp_month,
      lmp_year = excluded.lmp_year,
      edd_day = excluded.edd_day,
      edd_month = excluded.edd_month,
      edd_year = excluded.edd_year,
      counseling_given = excluded.counseling_given,
      checkup_12 = excluded.checkup_12,
      checkup_16 = excluded.checkup_16,
      checkup_20_24 = excluded.checkup_20_24,
      checkup_28 = excluded.checkup_28,
      checkup_32 = excluded.checkup_32,
      checkup_34 = excluded.checkup_34,
      checkup_36 = excluded.checkup_36,
      checkup_38_40 = excluded.checkup_38_40,
      checkup_other = excluded.checkup_other,
      iron_preg_received = excluded.iron_preg_received,
      iron_pnc_received = excluded.iron_pnc_received,
      vit_a_received = excluded.vit_a_received,
      delivery_place = excluded.delivery_place,
      newborn_condition = excluded.newborn_condition,
      pnc_check_24hr = excluded.pnc_check_24hr,
      pnc_check_3day = excluded.pnc_check_3day,
      pnc_check_7_14day = excluded.pnc_check_7_14day,
      pnc_check_42day = excluded.pnc_check_42day,
      pnc_check_other = excluded.pnc_check_other,
      family_planning_used = excluded.family_planning_used,
      remarks = excluded.remarks,
      updated_at = excluded.updated_at;`,
    [
      payload.id, payload.serial_no, payload.date_day, payload.date_month, payload.date_year, 
      payload.mother_name, payload.mother_age, 
      payload.lmp_day, payload.lmp_month, payload.lmp_year, 
      payload.edd_day, payload.edd_month, payload.edd_year, 
      payload.counseling_given, payload.checkup_12, payload.checkup_16, payload.checkup_20_24, payload.checkup_28, 
      payload.checkup_32, payload.checkup_34, payload.checkup_36, payload.checkup_38_40, payload.checkup_other, 
      payload.iron_preg_received, payload.iron_pnc_received, payload.vit_a_received, payload.delivery_place, 
      payload.newborn_condition, payload.pnc_check_24hr, payload.pnc_check_3day, payload.pnc_check_7_14day, 
      payload.pnc_check_42day, payload.pnc_check_other, payload.family_planning_used, payload.remarks, 
      now, now
    ]
  );

  return {
    ...payload,
    created_at: now,
    updated_at: now
  };
}

export async function getAllHmisRecords(): Promise<HmisRecordStoreType[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<HmisRecordStoreType>(
    `SELECT * FROM hmis_record ORDER BY date_year DESC, date_month DESC, date_day DESC, serial_no ASC`
  );
  return rows;
}

export async function deleteHmisRecord(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM hmis_record WHERE id = ?`, [id]);
}

export async function getNextSerialNo(): Promise<number> {
  const db = await getDb();
  const result = await db.getFirstAsync<{ max_sn: number }>(
    `SELECT MAX(serial_no) as max_sn FROM hmis_record`
  );
  return (result?.max_sn || 0) + 1;
}

export async function getHmisRecord(id: string): Promise<HmisRecordStoreType | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<HmisRecordStoreType>(
    `SELECT * FROM hmis_record WHERE id = ?`,
    [id]
  );
  return row;
}
