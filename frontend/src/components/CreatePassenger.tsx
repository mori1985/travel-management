import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreatePassenger = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [packId, setPackId] = useState('');
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3000/passengers',
        {
          name,
          phone,
          packId: Number(packId),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/passengers');
    } catch (err: any) {
      console.error('Create passenger error:', err.response?.data || err.message);
      setError(`خطا در ایجاد مسافر: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">ایجاد مسافر جدید</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="name">
              نام و نام خانوادگی
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg text-right"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="phone">
              شماره تلفن
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
            ایجاد مسافر
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePassenger;