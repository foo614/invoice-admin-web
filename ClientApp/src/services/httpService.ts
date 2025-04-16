import { message } from 'antd';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { refreshJWToken } from './ant-design-pro/authService';

// Track if we're already refreshing to prevent multiple concurrent refreshes
let isRefreshing = false;
// Queue for requests waiting for token refresh
let failedRequestsQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}> = [];

// Create Axios instance
const httpClient = axios.create({
  baseURL: `${API_BASE_URL}`,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    // Retrieve token from local storage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const parseUser = JSON.parse(currentUser);
      const token = parseUser?.token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried

      // If we're already refreshing, add to queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
          throw new Error('No current user found');
        }

        const parseUser: API.CurrentUser = JSON.parse(currentUser);
        const refreshToken = parseUser.refreshToken;
        const jwToken = parseUser.token;
        if (!refreshToken) {
          throw new Error('No refresh token found');
        }

        const refreshResponse = await refreshJWToken({ token: jwToken, refreshToken });
        const { token, refreshToken: newRefreshToken } = refreshResponse.data.data;

        // Update stored tokens
        parseUser.token = token;
        parseUser.refreshToken = newRefreshToken;
        localStorage.setItem('currentUser', JSON.stringify(parseUser));

        // Update Authorization header
        httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Process queued requests
        failedRequestsQueue.forEach(({ resolve }) => resolve(token));
        failedRequestsQueue = [];

        // Retry original request
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (refreshError: any) {
        // Clear queue and user data if refresh fails
        failedRequestsQueue.forEach(({ reject }) => reject(refreshError));
        failedRequestsQueue = [];

        localStorage.removeItem('currentUser');
        message.error('Session expired. Please log in again.');
        window.location.href =
          (process.env.NODE_ENV !== 'development' ? '/web-portal' : '') + '/user/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
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
      message.error('No response from the server. Please check your connection.');
    } else {
      message.error('Request failed. Please try again.');
    }

    return Promise.reject(error);
  },
);

export default httpClient;
