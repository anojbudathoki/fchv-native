export type MotherStoreType = {
  id: string;
  code: string | null;
  is_synced: number;
  is_deleted: number;
  name: string | null;
  age: number | null;
  phone: string | null;
  address: string | null;
  husband_name: string | null;
  ethnicity: string | null;
  education: string | null;
  photo: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateMotherPayload = {
  id: string;
  code?: string;
  name?: string;
  age?: number;
  phone?: string;
  address?: string;
  husband_name?: string;
  ethnicity?: string;
  education?: string;
  photo?: string;
  is_synced?: boolean;
};
