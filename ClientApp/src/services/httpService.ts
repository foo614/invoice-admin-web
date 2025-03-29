import { message } from 'antd';
import axios from 'axios';

// Base URL from environment configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:5001/api';

// Create Axios instance
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    // Retrieve token from local storage
    const token = localStorage.getItem('authToken');
    if (token) {
      // Add Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    message.error('Error in request. Please try again.');
    return Promise.reject(error);
  },
);

// Response interceptor
httpClient.interceptors.response.use(
  (response) => {
    // Directly return response for success cases
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle specific status codes
      switch (status) {
        case 401:
          message.error('Unauthorized! Please log in again.');
          localStorage.removeItem('authToken');
          window.location.href = '/user/login'; // Redirect to login page
          break;

        case 403:
          message.error('Access denied.');
          break;

        case 404:
          message.error(data?.message || 'Resource not found.');
          break;

        case 500:
          message.error('Server error. Please try again later.');
          break;

        default:
          message.error(data?.message || 'An error occurred. Please try again.');
      }
    } else if (error.request) {
      // No response received from the server
      message.error('No response from the server. Please check your connection.');
    } else {
      // Errors in setting up the request
      message.error('Request failed. Please try again.');
    }
    return Promise.reject(error);
  },
);

export default httpClient;
