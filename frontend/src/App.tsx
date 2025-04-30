import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Packs from './components/Packs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/packs" element={<Packs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;