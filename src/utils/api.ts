import axios, { AxiosError, AxiosInstance } from 'axios';

import {
  apiBaseUrl,
  apiReportBaseUrl,
  apiIntegrationBaseUrl,
  apiReportOdataBaseUrl
} from '@constants/api-urls';
import { authService } from '@services/auth.ts';

// API Client factory
const createAPIClient = ({ baseURL }: { baseURL: string }) => {
  const api: AxiosInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  api.interceptors.request.use(async (config) => {
    await authService.axiosRequestMiddleware(config.headers);
    config.headers.Authorization = `Bearer ${authService.getToken()}`;
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      void authService.axiosResponseMiddleware(error.response?.status);
      return Promise.reject(error);
    }
  );

  return api;
};

export const api = createAPIClient({ baseURL: apiBaseUrl });
export const reportApi = createAPIClient({ baseURL: apiReportBaseUrl });
export const reportOdataApi = createAPIClient({
  baseURL: apiReportOdataBaseUrl
});
export const integrationApi = createAPIClient({
  baseURL: apiIntegrationBaseUrl
});
