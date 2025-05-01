import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateBus = () => {
  const [plate, setPlate] = useState('');
  const [driver, setDriver] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [packId, setPackId] = useState('');
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3000/buses',
        {
          plate,
          driver,
          driverPhone,
          packId: Number(packId),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/buses');
    } catch (err: any) {
      console.error('Create bus error:', err.response?.data || err.message);
      setError(`خطا در ایجاد اتوبوس: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">ایجاد اتوبوس جدید</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="plate">
              پلاک
            </label>
            <input
              type="text"
              id="plate"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="w-full p-3 border rounded-lg text-right"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="driver">
              نام راننده
            </label>
            <input
              type="text"
              id="driver"
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
              className="w-full p-3 border rounded-lg text-right"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="driverPhone">
              تلفن راننده
            </label>
            <input
              type="text"
              id="driverPhone"
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              className="w-full p-3 border rounded-lg text-right"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="packId">
              شناسه پک
            </label>
            <input
              type="number"
              id="packId"
              value={packId}
              onChange={(e) => setPackId(e.target.value)}
              className="w-full p-3 border rounded-lg text-right"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            ایجاد اتوبوس
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBus;