export type PregnancyStoreType = {
  id: string;
  is_synced: number;
  is_deleted: number;
  name: string | null;
  lmp_date: string;
  caretakers_name: string | null;
  caretakers_phone: string | null;
  expected_delivery_date: string | null;
  is_current: number;
  parity: number | null;
  selected: number;
  created_at: string;
  updated_at: string;
};

export interface PregnancyData {
  id: string;
  name: string;
  lmp_date: string;
  caretakers_name: string;
  caretakers_phone: string;
  expected_delivery_date: string;
  parity: number;
  created_at: string;
  updated_at: string;
} 

export type CreatePregnancyPayload = {
  id: string;
  name?: string;
  lmp_date: string;
  caretakers_name?: string;
  caretakers_phone?: string;
  expected_delivery_date?: string;
  is_current?: boolean;
  parity?: number;
  selected: boolean;
  is_synced?: boolean;
};
