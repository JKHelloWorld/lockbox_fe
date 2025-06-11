import axios, {
  AxiosProgressEvent,
  AxiosResponse,
  HttpStatusCode,
} from "axios";
import { BE_ENDPOINT } from "../commons/commons";
const API_URL = `${BE_ENDPOINT}/api/lock`;

export const LockFilService = {
  lockFile: async (
    payload: {
      filename: string;
      data: string;
      expiryDate: Date;
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
      throw new Error(`Error locking file: ${response.statusText}`);
    }

    return response.data;
  },
};
