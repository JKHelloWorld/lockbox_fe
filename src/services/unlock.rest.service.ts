import axios, {
  AxiosProgressEvent,
  AxiosResponse,
  HttpStatusCode,
} from "axios";
import { BE_ENDPOINT } from "../commons/commons";
const API_URL = `${BE_ENDPOINT}/api/unlock`;

export const UnlockRestService = {
  unlockFile: async (
    payload: {
      data: string;
      secret: string;
    },
    onUploadProgress: (loaded: number | undefined) => void,
  ): Promise<{
    filename: string;
    data: string;
  }> => {
    const response: AxiosResponse = await axios.post<{
      filename: string;
      data: string;
    }>(API_URL, payload, {
      responseType: "json",
      onUploadProgress: (progressEvent: AxiosProgressEvent) =>
        onUploadProgress(progressEvent.progress),
    });

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`Error unlocking file: ${response.statusText}`);
    }

    return response.data;
  },
};
