import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'https://udhaar-khata-0t2u.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for attaching JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      // Handle professional fintech error scenarios
      switch (response.status) {
        case 401:
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirect to login if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
        case 404:
          toast.error('Requested resource not found.');
          break;
        case 500:
          toast.error('Internal Server Error. Please try again later.');
          break;
        default:
          toast.error(response.data?.message || 'An unexpected error occurred.');
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;