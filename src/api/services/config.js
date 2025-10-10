import axios from 'axios';

const API_BASE_URL = 'https://pablomonteserin.com/sites/borrame-bonvet';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
  timeout: 10000,
});

export default api;
