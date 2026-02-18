import axios from 'axios';
import { BASE_URL } from '../utils/constant';

export const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

API.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem('token');

//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

  return config;
});
