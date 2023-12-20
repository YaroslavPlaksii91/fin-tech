import axios, { AxiosInstance } from 'axios';
import Cookie from 'js-cookie';

import Logger from './logger';

import { apiBaseUrl } from '@constants/api-urls';
import { cookiesKeys } from '@constants/common';

const Api: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

Api.interceptors.request.use((config) => {
  const credentialsCookie = Cookie.get(cookiesKeys.credentials);
  if (credentialsCookie) {
    const decodedCredentials = decodeURIComponent(credentialsCookie);
    const [storedUsername, storedPassword] = decodedCredentials.split(':');
    const credentials = btoa(storedUsername + ':' + storedPassword);
    const basicAuth = 'Basic ' + credentials;
    config.headers['Authorization'] = `${basicAuth}`;
  }
  return config;
});

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      Logger.error(error);
    }
    return Promise.reject(error);
  }
);

export default Api;
