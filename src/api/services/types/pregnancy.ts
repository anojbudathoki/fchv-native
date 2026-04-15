import {
  CommonBulkType,
  CommonSyncTimestampParam,
  PaginationParams
} from "./common";

export type pregnancyBulkType = {
  id: string;
  name: string;
  lmp_date: string;
  session_start: string;
  caretakers_name: string;
  caretakers_phone: string;
  expected_delivery_date: string;
  parity: number;
  session_end: string;
} & CommonBulkType;

export type PregnancyAPIResponse = {
  id: string;
  session_start: string;
  session_end: string;
  count: number;
} & CommonBulkType;

export type PregnancyAPIParams = Partial<
  PaginationParams & CommonSyncTimestampParam
>;
