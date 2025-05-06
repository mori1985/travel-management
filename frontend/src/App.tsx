import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Packs from './components/Packs';
import Passengers from './components/Passengers';
import Buses from './components/Buses';
import CreateNormalPassenger from './components/CreateNormalPassenger';
import CreateVipPassenger from './components/CreateVipPassenger';
import CreatePack from './components/CreatePack';
import CreateBus from './components/CreateBus';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<h2 className="text-center mt-10">عدم دسترسی</h2>} />
          <Route element={<ProtectedRoute allowedRoles={['level1', 'level2', 'admin']} />}>
            <Route path="/packs" element={<Packs />} />
            <Route path="/passengers" element={<Passengers />} />
            <Route path="/buses" element={<Buses />} />
            <Route path="/packs/create" element={<CreatePack />} />
            <Route path="/buses/create" element={<CreateBus />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['level1', 'admin']} />}>
            <Route path="/passengers/create/normal" element={<CreateNormalPassenger />} />
            <Route path="/passengers/create/vip" element={<CreateVipPassenger />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;