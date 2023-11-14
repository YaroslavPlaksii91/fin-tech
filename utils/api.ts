import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import apiUrls from '@constants/api-urls';

const api = axios.create({
  baseURL: apiUrls.apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en'
  }
});

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.url = encodeURI(config.url as string);
    return config;
  },
  (err) => Promise.reject(err)
);

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err) => Promise.reject(err)
);

export default api;
