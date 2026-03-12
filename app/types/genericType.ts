import axios, { AxiosError } from 'axios';
import { API } from '../api/client';
import { log } from '../utils/helper';
import { BASE_URL } from '../utils/constant';
import { Alert } from 'react-native';

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  value?: T;
  hasMore?: boolean;
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

const getFileType = (uri: string) => {
  const extension = uri.split(".").pop()?.toLowerCase();

  if (extension === "jpg" || extension === "jpeg") {
    return "image/jpeg";
  }

  if (extension === "png") {
    return "image/png";
  }

  return null;
};
export const uploadProfile = async ({
  email,
  profileImages,
  galleryImages = [],
}: any) => {
  const formData = new FormData();
  formData.append("email", email);

let  fileType: string | null = ''
if(profileImages)
   fileType = getFileType(profileImages);

if (profileImages && !fileType) {
  Alert.alert("Only JPG, JPEG and PNG images are allowed");
  return;
}

  // single profile image
  if(profileImages) {
    formData.append("profileImages", {
      uri: profileImages,
      type: fileType,
      name: `profile.${profileImages.split(".").pop()}`,
    });
  }

  // ✅ Gallery Images (Multiple)
if (galleryImages?.length > 0) {
  galleryImages.forEach((uri: string, index: number) => {
    const fileType = getFileType(uri);
    if (!fileType) return;

    formData.append("gallery", {
      uri: uri,
      type: fileType,
      name: `gallery_${index}.${uri.split(".").pop()}`,
    });
  });
}

  try {
    const response = await API.post(
      `${BASE_URL}/profilePic`,
      formData,
      {
          headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
        return { status: false, message: error instanceof Error ? error.message : 'Upload failed' };
  }
};