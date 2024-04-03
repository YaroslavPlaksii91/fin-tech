import axios, { AxiosError, AxiosInstance } from 'axios';

import { apiBaseUrl, apiReportBaseUrl } from '@constants/api-urls';
import { authService } from '@services/auth.ts';

// const Api: AxiosInstance = axios.create({
//   baseURL: apiBaseUrl,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// Api.interceptors.request.use(async (config) => {
//   await authService.axiosRequestMiddleware();
//   return config;
// });

// Api.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     authService.axiosResponseMiddleware(error);
//     return Promise.reject(error);
//   }
// );

// export default Api;

// API Client factory
const createAPIClient = ({ baseURL }: { baseURL: string }) => {
  const api: AxiosInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  api.interceptors.request.use(async (config) => {
    await authService.axiosRequestMiddleware();
    config.headers.Authorization = `Bearer ${authService.getToken()}`;
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      authService.axiosResponseMiddleware(error);
      return Promise.reject(error);
    }
  );

  return api;
};

export const api = createAPIClient({ baseURL: apiBaseUrl });
export const reportApi = createAPIClient({ baseURL: apiReportBaseUrl });
