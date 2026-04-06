import axios from 'axios';
import router from '@/router';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor for Request: Inject token
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

// Interceptor for Response: Handle errors (401, 403)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle 401 Unauthorized
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('user');
                router.push({ name: 'login' });
            }
            // Handle 403 Forbidden
            else if (error.response.status === 403) {
                console.error('Access denied/Forbidden:', error.response.data.message);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
