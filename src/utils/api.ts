import axios, { AxiosError, AxiosInstance } from 'axios';

import {
  apiBaseUrl,
  apiReportBaseUrl,
  apiIntegrationBaseUrl
} from '@constants/api-urls';
import { authService } from '@services/auth';

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
      // Debugging
      if (error.response?.status === 401) {
        if (authService.isTokenSet()) {
          await authService.axiosResponseMiddleware(401);
        } else {
          authService.redirectToAuthorize();
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export const api = createAPIClient({ baseURL: apiBaseUrl });
export const reportApi = createAPIClient({ baseURL: apiReportBaseUrl });
export const integrationApi = createAPIClient({
  baseURL: apiIntegrationBaseUrl
});
