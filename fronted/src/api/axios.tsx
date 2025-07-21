// lib/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://doctorappointmentbackend-ilmx.onrender.com/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
   
      const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];
    // You can add headers here if needed
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
 
    return config;
  },

  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;