import axios, { AxiosInstance } from 'axios';

import { apiBaseUrl } from '@constants/api-urls';

const api: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

const setAuthHeader = (token: string) => {
  if (token) {
    api.defaults.headers['Authorization'] = `Token ${token}`;
  } else {
    delete api.defaults.headers['Authorization'];
  }
};

export { setAuthHeader };

export default api;
