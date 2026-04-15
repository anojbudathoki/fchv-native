import { API_LIST } from "@/api/API_LIST";
import { httpClient } from "@/api/client/httpClient";
import { CreatePregnancyPayload } from "@/hooks/database/types/pregnancyModal";


const postPregnancy = async (data: CreatePregnancyPayload) => {
  const response = await httpClient.post<CreatePregnancyPayload>(
    `${API_LIST.pregnant_mother.post}`,
    data
  );
  return response.data;
};

export { postPregnancy };
