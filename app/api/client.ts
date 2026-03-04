import axios from 'axios';
import { BASE_URL } from '../utils/constant';

export const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

API.interceptors.request.use((request)=> {
  console.log('Starting Request', JSON.stringify(request.data, null, 2))
  return request
})

// API.interceptors.response.use((response) => {
//   console.log('Response:', JSON.stringify(response, null, 2));
//   return response;
// }, (error) => {
//   console.log('Error Response:', JSON.stringify(error.response, null, 2));
//   return Promise.reject(error);
// }); 
API.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem('token');

//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

  return config;
});
