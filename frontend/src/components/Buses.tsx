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
        console.log('Fetching buses with token:', token);
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
    <div className="container mx-auto p-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-right">لیست اتوبوس‌ها</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-4 flex justify-between flex-col sm:flex-row">
          <div></div>
          <Link
            to="/buses/create"
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            ایجاد اتوبوس جدید
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>شناسه</th>
                <th>پلاک</th>
                <th>راننده</th>
                <th>تلفن راننده</th>
                <th>شناسه پک</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.id}>
                  <td>{bus.id}</td>
                  <td>{bus.plate}</td>
                  <td>{bus.driver}</td>
                  <td>{bus.driverPhone}</td>
                  <td>{bus.packId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Buses;