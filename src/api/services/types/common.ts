type CommonBulkType = {
  deleted: boolean;
  created_at: string;
  updated_at: string;
};

type PaginationParams = {
  page: number;
  page_size: number;
};

type CommonSyncTimestampParam = {
  sync_timestamp: string | null;
};

export { CommonBulkType, CommonSyncTimestampParam, PaginationParams };
