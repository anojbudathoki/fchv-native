export interface HmisRecordStoreType {
  id: string;
  serial_no: number | null;
  date_day: number | null;
  date_month: number | null;
  date_year: number | null;
  mother_name: string | null;
  mother_age: number | null;
  lmp_day: number | null;
  lmp_month: number | null;
  lmp_year: number | null;
  edd_day: number | null;
  edd_month: number | null;
  edd_year: number | null;
  counseling_given: number | null; // 0 or 1
  checkup_12: number | null;
  checkup_20: number | null;
  checkup_26: number | null;
  checkup_30: number | null;
  checkup_34: number | null;
  checkup_36: number | null;
  checkup_38: number | null;
  checkup_40: number | null;
  checkup_other: string | null;
  iron_preg_received: number | null;
  iron_pnc_received: number | null;
  vit_a_received: number | null;
  delivery_place: string | null;
  newborn_condition: string | null;
  pnc_check_24hr: number | null;
  pnc_check_3day: number | null;
  pnc_check_7_14day: number | null;
  pnc_check_42day: number | null;
  pnc_check_other: string | null;
  family_planning_used: number | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateHmisRecordPayload = Omit<HmisRecordStoreType, 'created_at' | 'updated_at'>;
