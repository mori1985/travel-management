import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Bus {
  id: number;
  plate: string;
  driver: string;
  driverPhone: string;
  packId: number;
}

const Buses = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/buses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBuses(response.data);
        setError('');
      } catch (err: any) {
        console.error('Fetch buses error:', err.response?.data || err.message);
        setError('خطا در بارگذاری اتوبوس‌ها. لطفاً دوباره تلاش کنید.');
      }
    };
    if (token) fetchBuses();
  }, [token]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-right">لیست اتوبوس‌ها</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="mb-4 flex justify-between">
        <div></div>
        <Link
          to="/buses/create"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          ایجاد اتوبوس جدید
        </Link>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border text-right">شناسه</th>
            <th className="p-2 border text-right">پلاک</th>
            <th className="p-2 border text-right">راننده</th>
            <th className="p-2 border text-right">تلفن راننده</th>
            <th className="p-2 border text-right">شناسه پک</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus.id}>
              <td className="p-2 border text-right">{bus.id}</td>
              <td className="p-2 border text-right">{bus.plate}</td>
              <td className="p-2 border text-right">{bus.driver}</td>
              <td className="p-2 border text-right">{bus.driverPhone}</td>
              <td className="p-2 border text-right">{bus.packId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Buses;