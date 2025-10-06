import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Update this URL to your backend API
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7112/api/';

// Add a request interceptor
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken'); // Use authToken instead of token
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear auth data and redirect to login page if unauthorized
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;