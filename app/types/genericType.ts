import { API } from "../api/client";

export interface ApiResponse<T> {
    status: boolean;
    message: string;
    value: T;
  }

  export const postApi = async <T, P = unknown>(
    url: string,
    payload: P
  ): Promise<ApiResponse<T>> => {
    const { data } = await API.post<ApiResponse<T>>(url, payload);
    return data;
  };