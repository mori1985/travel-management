import React, { useEffect } from 'react';
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
import ErrorBoundary from './components/ErrorBoundary'; // اضافه کردن ErrorBoundary
import BusAssignment from './components/BusAssignment';
import FinalConfirmation from './components/FinalConfirmation';



const AppContent = () => {
  const { token, setToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleTokenExpired = () => {
      if (token) {
        setToken(null);
        localStorage.removeItem('token');
        window.location.href = '/login?message=' + encodeURIComponent('توکن منقضی شده است. لطفاً دوباره وارد شوید.');
      }
    };

    window.addEventListener('tokenExpired', handleTokenExpired);

    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
    };
  }, [token, setToken]);

  return (
    <ErrorBoundary> {/* اضافه کردن ErrorBoundary */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
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
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;