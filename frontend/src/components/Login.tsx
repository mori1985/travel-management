import React, { useState, useContext, useEffect } from 'react';
import { axiosInstance } from '../axiosConfig'; // استفاده از axiosInstance به‌جای axios
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setToken, setRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    if (message) {
      setError(decodeURIComponent(message));
    }
  }, [location.search]);

  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending login request:', { username, password });
    try {
      const response = await axiosInstance.post('/auth/login', {
        username,
        password,
      });
      console.log('Login response:', JSON.stringify(response.data, null, 2));
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      setToken(token);
      const decoded = decodeToken(token);
      const userRole = decoded?.role || 'unknown';
      console.log('Decoded token:', decoded);
      setRole(userRole);
      localStorage.setItem('role', userRole);

      if (userRole === 'level1') {
        navigate('/passengers');
      } else if (userRole === 'level2' || userRole === 'admin') {
        navigate('/packs');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error('Login error:', err.response?.data || err.message);
      setError(`ورود ناموفق: ${err.response?.data?.message || err.message || 'مشکلی رخ داده است. لطفاً دوباره امتحان کنید.'}`);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url('/login-background.jpg')`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#e6f0fa',
      }}
    >
      {/* Overlay برای تنظیم روشنایی و کنتراست */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div
        className="p-8 rounded-xl shadow-2xl w-full max-w-md z-10 transform transition-all hover:scale-105 animate-fade-in"
        style={{
          backgroundColor: 'rgba(230, 240, 250, 0.3)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h2 className="text-4xl font-bold mb-6 text-center text-blue-700">ورود به سیستم</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right font-semibold" htmlFor="username">
              نام کاربری
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-right bg-gray-50"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-right font-semibold" htmlFor="password">
              رمز عبور
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-right bg-gray-50"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold shadow-md hover:shadow-lg"
          >
            ورود
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;