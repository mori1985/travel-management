import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import moment from 'jalali-moment';

interface Pack {
  id: number;
  travelDate: string;
  type: string;
  repository: number;
  company?: string;
  plate?: string;
  driver?: string;
  driverPhone?: string;
}

const Packs = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  const translateType = (type: string) => {
    return type === 'normal' ? 'عادی' : type === 'vip' ? 'ویژه' : type;
  };

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        console.log('Fetching packs with token:', token);
        const response = await axios.get('http://localhost:3000/packs', {
          params: { type: typeFilter },
          headers: { Authorization: `Bearer ${token}` },
        });
        setPacks(response.data);
        setError('');
      } catch (err: any) {
        console.error('Fetch packs error:', err.response?.data || err.message);
        setError('خطا در بارگذاری پک‌ها. لطفاً دوباره تلاش کنید.');
      }
    };
    if (token) fetchPacks();
  }, [token, typeFilter]);

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-right">پک‌های مسافرتی</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-4 flex justify-between flex-col sm:flex-row">
          <div className="mb-2 sm:mb-0">
            <label className="ml-2">فیلتر بر اساس نوع:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">همه</option>
              <option value="normal">عادی</option>
              <option value="vip">ویژه</option>
            </select>
          </div>
          <Link
            to="/packs/create"
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            ایجاد پک جدید
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border text-right">شناسه</th>
                <th className="p-2 border text-right">نوع</th>
                <th className="p-2 border text-right">تاریخ سفر</th>
                <th className="p-2 border text-right">شرکت</th>
              </tr>
            </thead>
            <tbody>
              {packs.map((pack) => (
                <tr key={pack.id}>
                  <td className="p-2 border text-right">{pack.id}</td>
                  <td className="p-2 border text-right">{translateType(pack.type)}</td>
                  <td className="p-2 border text-right">
                    {moment(pack.travelDate, 'YYYY-MM-DD').locale('fa').format('YYYY/MM/DD')}
                  </td>
                  <td className="p-2 border text-right">{pack.company || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Packs;