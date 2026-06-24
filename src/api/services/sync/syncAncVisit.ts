import { unSyncedAncVisits } from "@/hooks/database/models/AncVisitModel";
import { postBulkAncVisits } from "../anc_visit/mutation";
import { fetchAncVisitsFromServer } from "../anc_visit/queries";
import { sendUnsyncedToServer } from "./helper";

export async function sendUnsyncedAncVisitsToServer() {
  await sendUnsyncedToServer(unSyncedAncVisits, postBulkAncVisits, "anc_visit");
}

export async function getUnsyncedAncVisitsFromServer(
  last_synced_at: string | null,
) {
  await fetchAncVisitsFromServer({
    sync_timestamp: last_synced_at,
  });
}
