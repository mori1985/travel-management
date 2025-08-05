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

let isLoading = false; // متغیر لودینگ
export { isLoading }; // اکسپورت isLoading
const setLoading = (loading: boolean) => {
  isLoading = loading;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    setLoading(true); // شروع لودینگ
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    setLoading(false); // پایان لودینگ
    return response;
  },
  (error) => {
    setLoading(false); // پایان لودینگ حتی با خطا
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('tokenExpired'));
    } else if (error.response?.status === 404) {
      throw new Error('چنین آدرسی وجود ندارد');
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, setLoading }; // اکسپورت setLoading و axiosInstance