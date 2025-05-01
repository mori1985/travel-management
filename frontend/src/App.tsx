import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Packs from './components/Packs';
import CreatePack from './components/CreatePack';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/packs" element={<Packs />} />
        <Route path="/packs/create" element={<CreatePack />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;