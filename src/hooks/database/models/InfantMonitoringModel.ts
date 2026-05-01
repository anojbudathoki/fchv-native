import { getDb } from '../db';
import { CreateInfantMonitoringPayload, InfantMonitoringStoreType } from '../types/infantMonitoringModal';

export async function createInfantMonitoring(
  payload: CreateInfantMonitoringPayload
): Promise<InfantMonitoringStoreType> {
  const db = await getDb();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO hmis_infant_monitoring 
      (id, mother_id, mother_name, baby_name, baby_birth_day, baby_birth_month, 
       baby_birth_year, tole, birth_place, fchv_present, asphyxia_management,
       serial_no, umbilical_care, chest_to_chest, 
       breastfeeding_1hr, baby_weight, pnc_check_24hr, pnc_check_3day, 
       pnc_check_7_14day, pnc_check_42day, remarks, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      mother_id = excluded.mother_id,
      mother_name = excluded.mother_name,
      baby_name = excluded.baby_name,
      baby_birth_day = excluded.baby_birth_day,
      baby_birth_month = excluded.baby_birth_month,
      baby_birth_year = excluded.baby_birth_year,
      tole = excluded.tole,
      birth_place = excluded.birth_place,
      fchv_present = excluded.fchv_present,
      asphyxia_management = excluded.asphyxia_management,
      serial_no = excluded.serial_no,
      umbilical_care = excluded.umbilical_care,
      chest_to_chest = excluded.chest_to_chest,
      breastfeeding_1hr = excluded.breastfeeding_1hr,
      baby_weight = excluded.baby_weight,
      pnc_check_24hr = excluded.pnc_check_24hr,
      pnc_check_3day = excluded.pnc_check_3day,
      pnc_check_7_14day = excluded.pnc_check_7_14day,
      pnc_check_42day = excluded.pnc_check_42day,
      remarks = excluded.remarks,
      updated_at = excluded.updated_at;`,
    [
      payload.id, 
      payload.mother_id ?? null, 
      payload.mother_name ?? null, 
      payload.baby_name ?? null,
      payload.baby_birth_day ?? null,
      payload.baby_birth_month ?? null,
      payload.baby_birth_year ?? null,
      payload.tole ?? null,
      payload.birth_place ?? null,
      payload.fchv_present,
      payload.asphyxia_management,
      payload.serial_no ?? null, 
      payload.umbilical_care, 
      payload.chest_to_chest, 
      payload.breastfeeding_1hr, 
      payload.baby_weight ?? null, 
      payload.pnc_check_24hr, 
      payload.pnc_check_3day, 
      payload.pnc_check_7_14day, 
      payload.pnc_check_42day, 
      payload.remarks ?? null, 
      now, 
      now
    ]
  );

  return {
    ...payload,
    is_synced: 0,
    is_deleted: 0,
    created_at: now,
    updated_at: now
  };
}

export async function getAllInfantMonitorings(): Promise<InfantMonitoringStoreType[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<InfantMonitoringStoreType>(
    `SELECT * FROM hmis_infant_monitoring WHERE is_deleted = 0 ORDER BY created_at DESC`
  );
  return rows;
}

export async function deleteInfantMonitoring(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`UPDATE hmis_infant_monitoring SET is_deleted = 1, updated_at = ? WHERE id = ?`, [new Date().toISOString(), id]);
}

export async function getNextInfantSerialNo(): Promise<number> {
  const db = await getDb();
  const result = await db.getFirstAsync<{ max_sn: number }>(
    `SELECT MAX(serial_no) as max_sn FROM hmis_infant_monitoring`
  );
  return (result?.max_sn || 0) + 1;
}
