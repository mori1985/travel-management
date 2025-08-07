import axios from 'axios';

// مقدار پیش‌فرض برای baseURL با استفاده از import.meta.env
const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:3001'; // قابل تغییر برای دیپلوی
};

const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // ۱۰ ثانیه برای timeout
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('tokenExpired'));
    } else if (error.response?.status === 404) {
      throw new Error('چنین آدرسی وجود ندارد');
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };