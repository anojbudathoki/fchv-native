export type PaginationType<T> = {
  count: number;
  results: T[];
  next: string | null;
};

export type AppVersion = {
  latest: string;
  min_supported: string;
  android_store_url: string;
  ios_store_url: string;
};
