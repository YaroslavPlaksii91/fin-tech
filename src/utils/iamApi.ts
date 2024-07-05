import axios, { AxiosError, AxiosInstance } from 'axios';

import { authApiBaseUrl } from '@constants/api-urls.ts';
import { authService } from '@services/auth';

const IAMApi: AxiosInstance = axios.create({
  baseURL: authApiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

IAMApi.interceptors.request.use(async (config) => {
  await authService.axiosRequestMiddleware(config.headers);
  config.headers.Authorization = `Bearer ${authService.getToken()}`;
  return config;
});

IAMApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    void authService.axiosResponseMiddleware(error.response?.status);
    return Promise.reject(error);
  }
);

export default IAMApi;
