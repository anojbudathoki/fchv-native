type TableType =
  | "pregnancy"
  | "pregnancy_staging"

type SyncTableType = Extract<
  TableType,
  | "pregnancy"
  | "pregnancy_staging"
>;

type RunAsync = (sql: string, params?: any[]) => Promise<any>;

type Primitive = string | number | null | boolean;

export { Primitive, RunAsync, SyncTableType, TableType };
