import axios from 'axios';
import {useAuthStore} from '../store/authStore';
import {BASE_URL} from '../../keys.config';

const api = axios.create({
  baseURL: BASE_URL + '/api',
});

// Add request interceptor to include token
api.interceptors.request.use(config => {
  const {token} = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Set Content-Type header if not already set and not FormData (file upload)
  if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  } else {
    config.headers['Content-Type'] = 'multipart/form-data';
  }

  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log('401 error from api index');
    }
    return Promise.reject(error);
  },
);

export default api;
