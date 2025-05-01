import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Passenger {
  id: number;
  name: string;
  phone: string;
  packId: number;
}

const Passengers = () => {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/passengers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPassengers(response.data);
        setError('');
      } catch (err: any) {
        console.error('Fetch passengers error:', err.response?.data || err.message);
        setError('خطا در بارگذاری مسافران. لطفاً دوباره تلاش کنید.');
      }
    };
    if (token) fetchPassengers();
  }, [token]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-right">لیست مسافران</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="mb-4 flex justify-between">
        <div></div>
        <Link
          to="/passengers/create"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          ایجاد مسافر جدید
        </Link>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border text-right">شناسه</th>
            <th className="p-2 border text-right">نام</th>
            <th className="p-2 border text-right">تلفن</th>
            <th className="p-2 border text-right">شناسه پک</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((passenger) => (
            <tr key={passenger.id}>
              <td className="p-2 border text-right">{passenger.id}</td>
              <td className="p-2 border text-right">{passenger.name}</td>
              <td className="p-2 border text-right">{passenger.phone}</td>
              <td className="p-2 border text-right">{passenger.packId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Passengers;