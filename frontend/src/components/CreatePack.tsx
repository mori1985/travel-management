import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreatePack = () => {
  const [travelDate, setTravelDate] = useState('');
  const [type, setType] = useState('normal');
  const [repository, setRepository] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3000/packs',
        {
          travelDate,
          type,
          repository: Number(repository),
          company,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/packs');
    } catch (err: any) {
      console.error('Create pack error:', err.response?.data || err.message);
      setError(`خطا در ایجاد پک: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">ایجاد پک جدید</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="travelDate">
              تاریخ سفر
            </label>
            <input
              type="date"
              id="travelDate"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full p-3 border rounded-lg text-right"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="type">
              نوع
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 border rounded-lg text-right"
              required
            >
              <option value="normal">عادی</option>
              <option value="vip">ویژه</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="repository">
              انبار
            </label>
            <input
              type="number"
              id="repository"
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
              className="w-full p-3 border rounded-lg text-right"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="company">
              شرکت (اختیاری)
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-3 border rounded-lg text-right"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            ایجاد پک
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePack;