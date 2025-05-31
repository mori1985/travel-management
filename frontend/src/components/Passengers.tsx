import { useState, useEffect, useContext } from 'react';
import axios from '../axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import moment from 'jalali-moment';

interface Passenger {
  id: number;
  firstName: string;
  lastName: string;
  nationalCode: string;
  phone: string;
  stage: 'registered' | 'in-pack' | 'bus-assigned' | 'final-confirmed';
  stageText: string;
  packId?: number;
  travelType: 'normal' | 'vip';
  travelDate: string;
  returnDate?: string;
  birthDate?: string;
}

const PassengerSearch = () => {
  const [nationalCode, setNationalCode] = useState('');
  const [passenger, setPassenger] = useState<Passenger | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleSearch = async () => {
    if (!nationalCode || nationalCode.length !== 10) {
      setError('لطفاً کد ملی ۱۰ رقمی معتبر وارد کنید');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await axios.get(`/passengers/search?nationalCode=${nationalCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Response data:', response.data);
      setPassenger(response.data);
    } catch (err: any) {
      console.error('Search passenger error:', err.response?.data || err.message);
      setPassenger(null);
      setError('مسافری با این کد ملی یافت نشد یا خطایی رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setNationalCode('');
    setPassenger(null);
    setError('');
  };

  // تابع برای فرمت کردن تاریخ‌ها
  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    const cleanDate = date.split('T')[0]; // حذف بخش ساعت
    return moment(cleanDate, 'jYYYY-jMM-jDD').locale('fa').format('jD MMMM jYYYY'); // تاریخ رو به‌عنوان شمسی بخون
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6 flex justify-center items-center">
      <div className="w-full bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">جستجوی مسافر</h2>

        <div className="mb-6">
          <label className="block text-right text-gray-700 font-semibold mb-2">
            کد ملی (۱۰ رقم)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nationalCode}
              onChange={(e) => setNationalCode(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={10}
              placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰"
              className="w-full p-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none transition-all duration-300 text-right"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'در حال جستجو...' : 'جستجو'}
            </button>
          </div>
          {error && <p className="text-red-500 text-right mt-2">{error}</p>}
        </div>

        {passenger ? (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-right text-blue-600 mb-4">
              اطلاعات مسافر
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-right table-auto">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3 border border-gray-300 whitespace-nowrap">شناسه</th>
                    <th className="p-3 border border-gray-300 whitespace-nowrap">نام</th>
                    <th className="p-3 border border-gray-300 whitespace-nowrap">نام خانوادگی</th>
                    <th className="p-3 border border-gray-300 whitespace-nowrap">کد ملی</th>
                    <th className="p-3 border border-gray-300 whitespace-nowrap">تلفن</th>
                    <th className="p-3 border border-gray-300 whitespace-nowrap">نوع پک</th>
                    <th className="p-3 border border-gray-300 whitespace-nowrap">شناسه پک</th>
                    <th className="p-3 border border-gray-300 whitespace-nowrap">تاریخ رفت</th>
                    <th className="p-3 border border-gray-300 whitespace-nowrap">تاریخ برگشت</th>
                    <th className="p-3 border border-gray-300 whitespace-nowrap">تاریخ تولد</th>
                    <th className="p-3 border border-gray-300 whitespace-nowrap">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white hover:bg-gray-100">
                    <td className="p-3 border border-gray-300">{passenger.id}</td>
                    <td className="p-3 border border-gray-300">{passenger.firstName}</td>
                    <td className="p-3 border border-gray-300">{passenger.lastName}</td>
                    <td className="p-3 border border-gray-300">{passenger.nationalCode}</td>
                    <td className="p-3 border border-gray-300">{passenger.phone}</td>
                    <td className="p-3 border border-gray-300">{passenger.travelType === 'vip' ? 'VIP' : 'عادی'}</td>
                    <td className="p-3 border border-gray-300">{passenger.packId || '-'}</td>
                    <td className="p-3 border border-gray-300">{formatDate(passenger.travelDate)}</td>
                    <td className="p-3 border border-gray-300">{formatDate(passenger.returnDate)}</td>
                    <td className="p-3 border border-gray-300">{formatDate(passenger.birthDate)}</td>
                    <td className="p-3 border border-gray-300">{passenger.stageText}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          !error && !loading && (
            <p className="text-center text-gray-500">لطفاً کد ملی را وارد کنید و جستجو کنید</p>
          )
        )}

        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            پاک کردن
          </button>
          {/* <Link
            to="/passengers/create"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            ایجاد مسافر جدید
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default PassengerSearch;