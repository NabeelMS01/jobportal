import axios from 'axios';

import { logoutUser } from '@/store/slices/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite loops if the refresh or logout endpoints return 401
      if (originalRequest.url === '/api/auth/refresh' || originalRequest.url === '/api/auth/logout') {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is expired or invalid, logout the user
        // Avoid circular dependency by dynamically importing store
        const { store } = await import('@/store/store');
        store.dispatch(logoutUser());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
