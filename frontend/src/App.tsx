import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Packs from './components/Packs';
import CreatePack from './components/CreatePack';
import Passengers from './components/Passengers';
import CreatePassenger from './components/CreatePassenger';
import Buses from './components/Buses';
import CreateBus from './components/CreateBus';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/packs" element={<Packs />} />
        <Route path="/packs/create" element={<CreatePack />} />
        <Route path="/passengers" element={<Passengers />} />
        <Route path="/passengers/create" element={<CreatePassenger />} />
        <Route path="/buses" element={<Buses />} />
        <Route path="/buses/create" element={<CreateBus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;