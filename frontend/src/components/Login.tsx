import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setToken, setRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending login request:', { username, password });
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      console.log('Login response:', response.data);
      setToken(response.data.access_token);
      setRole(response.data.role); // فرض می‌کنیم بک‌اند role می‌فرسته
      navigate('/packs');
    } catch (err: any) {
      console.error('Login error:', err.response?.data || err.message, err);
      setError(`ورود ناموفق: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all hover:scale-105 animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">ورود به سیستم</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="username">
              نام کاربری
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="password">
              رمز عبور
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            ورود
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;