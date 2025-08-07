import { useState, useContext, useEffect } from 'react';
import { axiosInstance } from '../axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

const Login = () => {
  console.log('Login component rendered'); // برای دیباگ رندر چندباره
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
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

  const decodeToken = (token: string): { role?: string } | null => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        navigate('/passengers', { replace: true });
      } else if (userRole === 'level2' || userRole === 'admin') {
        navigate('/packs', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      console.error('Login error:', err.response?.data || err.message);
      setError(`ورود ناموفق: ${err.response?.data?.message || err.message || 'مشکلی رخ داده است.'}`);
    }
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>
      <div className="login-container">
        <h2 className="text-4xl font-bold mb-6 text-center text-blue-700">سامانه مدیریت مسافرین</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-5">
            <label className="form-label" htmlFor="username-input">
              نام کاربری
            </label>
            <input
              type="text"
              id="username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="mb-6">
            <label className="form-label" htmlFor="password-input">
              رمز عبور
            </label>
            <input
              type="password"
              id="password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            ورود
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;