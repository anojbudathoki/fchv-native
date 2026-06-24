import { API_LIST } from "@/api/API_LIST";
import { httpClient } from "@/api/client/httpClient";
import { clearTable } from "@/hooks/database/models/CommonModal";
import {
  insertToTempAncVisitTable,
  moveTempToRealAncVisitTable,
} from "@/hooks/database/models/AncVisitModel";
import { PaginationType } from "../types/global_api";

const fetchAncVisitsFromServer = async (
  params: { sync_timestamp?: string | null } = {},
) => {
  let URL = `${API_LIST.anc_visits.get}?page=1&page_size=200`;
  let isEOR = false;

  await clearTable("anc_visit_staging");

  while (!isEOR) {
    const res = await httpClient.get<PaginationType<any> | any[]>(URL, {
      params: { ...params, include_deleted: true, page_size: 200 },
    });

    const payload = res.data;
    const results = Array.isArray(payload)
      ? payload
      : payload.results ?? [];

    if (!Array.isArray(payload)) {
      isEOR = payload.next === null;
      if (payload.next) {
        URL = payload.next;
      }
    } else {
      isEOR = true;
    }

    if (results.length) {
      await insertToTempAncVisitTable(results);
    }
  }

  await moveTempToRealAncVisitTable();
  await clearTable("anc_visit_staging");
};

export { fetchAncVisitsFromServer };
