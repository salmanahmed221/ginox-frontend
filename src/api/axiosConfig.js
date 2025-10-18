import axios from 'axios';
import { store } from '../store/store';
import { SessionManager } from '../utils/sessionManager';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle session expiration and user not found
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is due to unauthorized access (401)
    if (error.response && error.response.status === 401) {
      const requestUrl = error.config?.url || '';
      // For auth flows (e.g., login), preserve server message instead of treating as session expiration
      const isAuthFlow = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register-with-google');
      if (!isAuthFlow) {
        SessionManager.handleSessionExpiration();
        return Promise.reject(new Error('Session expired. Please sign in again.'));
      }
      // Pass through original error so callers can show backend-provided message (e.g., Invalid password)
      return Promise.reject(error);
    }
    
    // Check if the error is due to user not found (404)
    if (error.response && error.response.status === 404) {
      SessionManager.handleUserNotFound();
      return Promise.reject(new Error('User not found. Please sign in again.'));
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 