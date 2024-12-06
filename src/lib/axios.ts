import axios from 'axios';

const BASE_URL = 'https://gorest.co.in/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
