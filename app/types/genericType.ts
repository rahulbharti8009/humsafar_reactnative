import { AxiosError } from 'axios';
import { API } from '../api/client';

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  value?: T;
}

export const postApi = async <T, P = unknown>(
  url: string,
  payload: P
): Promise<ApiResponse<T>> => {
  try {
    const { data } = await API.post<ApiResponse<T>>(url, payload);
    return data;
  } catch (error) {
    const err = error as AxiosError<ApiResponse<null>>;

    return {
      status: false,
      message: err.response?.data?.message ||   err.message || 'Network error',
    };
  }
};
