type TableType =
  | "mother"
  | "pregnancy"
  | "pregnancy_staging"
  | "mothers_group_meetings"

type SyncTableType = Extract<
  TableType,
  | "mother"
  | "pregnancy"
  | "pregnancy_staging"
>;

type RunAsync = (sql: string, params?: any[]) => Promise<any>;

type Primitive = string | number | null | boolean;

export { Primitive, RunAsync, SyncTableType, TableType };
