import { API_LIST } from "@/api/API_LIST";
import { httpClient } from "@/api/client/httpClient";
import { AncVisitStoreType } from "@/hooks/database/types/ancVisitModal";

const mapAncVisitToSyncPayload = (data: AncVisitStoreType) => ({
  id: data.id,
  mother: data.mother,
  name: data.name ?? null,
  visit_date: data.visit_date,
  visit_place: data.visit_place ?? null,
  reg_year: data.reg_year ?? null,
  reg_month: data.reg_month ?? null,
  updated_at: data.updated_at || new Date().toISOString(),
  deleted: data.is_deleted === 1,
});

const postAncVisit = async (data: AncVisitStoreType) => {
  const response = await httpClient.post<AncVisitStoreType | AncVisitStoreType[]>(
    API_LIST.anc_visits.post,
    [mapAncVisitToSyncPayload(data)],
  );

  const results = response.data;
  return Array.isArray(results) ? results[0] : results;
};

const postBulkAncVisits = async (data: AncVisitStoreType[]) => {
  const response = await httpClient.post<AncVisitStoreType[]>(
    API_LIST.anc_visits.post,
    data.map(mapAncVisitToSyncPayload),
  );

  return response.data;
};

export { postBulkAncVisits, postAncVisit };
