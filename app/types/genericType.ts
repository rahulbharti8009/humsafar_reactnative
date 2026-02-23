import axios, { AxiosError } from 'axios';
import { API } from '../api/client';
import { log } from '../utils/helper';

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
    log(url,"payload",payload)
    const { data } = await API.post<ApiResponse<T>>(url, payload);
    log(url, data)

    return data;
  } catch (error) {
    const err = error as AxiosError<ApiResponse<null>>;

    return {
      status: false,
      message: err.response?.data?.message ||   err.message || 'Network error',
    };
  }
};

export const uploadProfile = async ({
  email,
  profileImages,
  galleryImages = [],
}: any) => {
  const formData = new FormData();

  formData.append("email", email);

  // single profile image
  formData.append("profileImages", {
    uri: profileImages,
    type: "image/jpeg",
    name: "profile.jpg",
  } as any);

  try {
  
    
    const response = await axios.post(
      "http://10.11.127.147:8000/api/profilePic",
      formData,
      {
        headers: {
          // Accept: "application/json",
          // ❌ DO NOT manually set Content-Type in React Native
        },
      }
    );

    console.log("UPLOAD SUCCESS ✅", response.data);
  } catch (error) {
    console.log("UPLOAD ERROR ❌", error);
  }
};