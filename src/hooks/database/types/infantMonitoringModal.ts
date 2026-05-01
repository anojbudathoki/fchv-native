export interface InfantMonitoringStoreType {
  id: string;
  mother_id?: string;
  mother_name?: string;
  baby_name?: string;
  baby_birth_day?: number;
  baby_birth_month?: number;
  baby_birth_year?: number;
  tole?: string;
  birth_place?: string; // 'home', 'institution', 'trained_worker'
  fchv_present: number;
  asphyxia_management: number;
  serial_no?: number;
  umbilical_care: number;
  chest_to_chest: number;
  breastfeeding_1hr: number;
  baby_weight?: string; // 'normal', 'low', 'very_low'
  pnc_check_24hr: number;
  pnc_check_3day: number;
  pnc_check_7_14day: number;
  pnc_check_42day: number;
  remarks?: string;
  is_synced: number;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}

export type CreateInfantMonitoringPayload = Omit<
  InfantMonitoringStoreType,
  'is_synced' | 'is_deleted' | 'created_at' | 'updated_at'
>;
