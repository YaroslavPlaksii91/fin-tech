import axios, { AxiosError, AxiosInstance } from 'axios';

import { apiBaseUrl } from '@constants/api-urls';
import { authService } from '@services/auth.ts';

const Api: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

Api.interceptors.request.use(async (config) => {
  await authService.axiosRequestMiddleware();
  return config;
});

Api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    authService.axiosResponseMiddleware(error);
    return Promise.reject(error);
  }
);

export default Api;
