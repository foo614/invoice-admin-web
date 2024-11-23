import { message } from 'antd';
import axios from 'axios';

// Create Axios instance
const httpClient = axios.create({
  // baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    message.error('Error in request. Please try again.');
    return Promise.reject(error);
  },
);

// Response interceptor
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        message.error('Unauthorized! Please log in again.');
        localStorage.removeItem('authToken');
        window.location.href = '/user/login';
      } else if (status === 403) {
        message.error('Access denied.');
      } else if (status >= 500) {
        message.error('Server error. Please try again later.');
      } else {
        message.error(data.message || 'An error occurred.');
      }
    } else if (error.request) {
      message.error('No response from the server. Please check your connection.');
    } else {
      message.error('Request failed. Please try again.');
    }
    return Promise.reject(error);
  },
);

export default httpClient;
