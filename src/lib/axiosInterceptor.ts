import axios from 'axios';

// Define API base URL here to avoid circular dependency with api.ts
// Using the proxy defined in vite.config.ts for development
export const API_BASE_URL = "/api";

// Create a custom axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      headers: config.headers,
      params: config.params,
      data: config.data
    });
    
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      config: error.config ? {
        method: error.config.method,
        url: error.config.url,
        baseURL: error.config.baseURL,
        data: error.config.data
      } : 'No config',
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response'
    });
    
    // Handle 401 Unauthorized errors (expired or invalid token)
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      
      // Only redirect to login if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 