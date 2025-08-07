import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Packs from './components/Packs';
import Passengers from './components/Passengers';
import CreateNormalPassenger from './components/CreateNormalPassenger';
import CreateVipPassenger from './components/CreateVipPassenger';
import CreatePack from './components/CreatePack';
import CreateBus from './components/CreateBus';
import ErrorBoundary from './components/ErrorBoundary';
import BusAssignment from './components/BusAssignment';
import FinalConfirmation from './components/FinalConfirmation';
import AdminReport from './components/AdminReport';
import SendSMS from './components/SendSMS';
import SmsReport from './components/SmsReport';

// کامپوننت جدید برای مدیریت رفرش در مسیر "/"
const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // فقط تو مسیر "/" و بار اول رفرش کن
    if (location.pathname === '/') {
      // چک می‌کنیم که قبلاً رفرش نشده باشه (با یه فلگ در sessionStorage)
      const hasRefreshed = sessionStorage.getItem('hasRefreshed');
      if (!hasRefreshed) {
        console.log('Performing auto-refresh on root path');
        sessionStorage.setItem('hasRefreshed', 'true');
        window.location.reload();
      }
    }
  }, [location.pathname]);

  // بعد از رفرش، ریدایرکت به مسیر مناسب
  return isAuthenticated ? (
    <Navigate to={localStorage.getItem('role') === 'level1' ? '/passengers' : '/packs'} replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

const AppContent = () => {
  const { token, setToken } = useAuth();
  const location = useLocation();

  console.log('AppContent rendered, token:', token); // برای دیباگ

  useEffect(() => {
    const handleTokenExpired = () => {
      if (token) {
        console.log('Token expired, logging out...');
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login?message=' + encodeURIComponent('توکن منقضی شده است. لطفاً دوباره وارد شوید.');
      }
    };

    window.addEventListener('tokenExpired', handleTokenExpired);
    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
    };
  }, [token, setToken]);

  return (
    <ErrorBoundary>
      {location.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<h2 className="text-center mt-10">عدم دسترسی</h2>} />
        <Route element={<ProtectedRoute allowedRoles={['level1', 'level2', 'admin']} />}>
          <Route path="/packs" element={<Packs />} />
          <Route path="/passengers" element={<Passengers />} />
          <Route path="/packs/create" element={<CreatePack />} />
          <Route path="/buses/create" element={<CreateBus />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['level1', 'admin']} />}>
          <Route path="/passengers/create/normal" element={<CreateNormalPassenger />} />
          <Route path="/passengers/create/vip" element={<CreateVipPassenger />} />
          <Route path="/bus-assignment" element={<BusAssignment />} />
          <Route path="/final-confirmation" element={<FinalConfirmation />} />
          <Route path="/admin-report" element={<AdminReport />} />
          <Route path="/send-sms/:packId" element={<SendSMS />} />
          <Route path="/sms-report" element={<SmsReport />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

const App = () => {
  console.log('App component rendered'); // برای دیباگ
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

export default App;