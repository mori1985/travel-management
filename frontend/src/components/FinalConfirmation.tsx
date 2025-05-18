import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

interface Passenger {
  id: number;
  firstName: string;
  lastName: string;
  nationalCode: string;
  phone: string;
  travelDate: string;
  returnDate?: string;
  birthDate?: string;
  leaderName?: string;
  leaderPhone?: string;
  gender: string;
}

interface BusAssignment {
  company: string;
  plate: string;
  driver: string;
  driverPhone: string;
}

interface Pack {
  id: number;
  travelDate: string;
  type: 'normal' | 'vip';
  status: 'pending' | 'assigned' | 'confirmed';
  passengers: Passenger[];
  busAssignment?: BusAssignment;
}

const FinalConfirmation = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [showReturnConfirm, setShowReturnConfirm] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // چک کردن نقش کاربر
  const role = localStorage.getItem('role');
  useEffect(() => {
    if (role !== 'admin') {
      navigate('/'); // هدایت به صفحه اصلی اگه نقش admin نبود
    }
  }, [role, navigate]);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await axios.get('/final-confirmation');
        setPacks(response.data);
      } catch (err: any) {
        console.error('Error fetching packs:', err);
        alert('خطا در بارگذاری پک‌ها: ' + (err.response?.data?.message || err.message));
      }
    };

    fetchPacks();

    const initialPack = location.state?.pack;
    if (initialPack && initialPack.status === 'confirmed') {
      setPacks((prevPacks) => {
        if (prevPacks.some((p) => p.id === initialPack.id)) {
          return prevPacks;
        }
        return [...prevPacks, initialPack];
      });
    }
  }, [location.state]);

  const handleRevert = async (packId: number) => {
    try {
      const response = await axios.post(`/final-confirmation/revert/${packId}`);
      console.log('Revert response:', response.data);
      setPacks((prevPacks) => prevPacks.filter((p) => p.id !== packId));
      setShowReturnConfirm(null);
      navigate('/bus-assignment', { state: { pack: response.data.updatedPack } });
    } catch (err: any) {
      console.error('Error reverting pack:', err);
      alert('خطا در بازگشت به مرحله قبل: ' + (err.response?.data?.message || err.message));
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-purple-200 p-6">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">مرحله تأیید نهایی و ارسال پیامک</h1>
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => navigate('/bus-assignment')}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-300"
        >
          بازگشت به تخصیص اتوبوس
        </button>
      </div>

      {packs.length === 0 ? (
        <p className="text-center text-gray-600">هیچ پکی برای تأیید نهایی موجود نیست</p>
      ) : (
        <div className="space-y-6">
          {packs.map((pack) => (
            <div key={pack.id} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                پک {pack.type === 'vip' ? 'VIP' : 'عادی'} - تاریخ: {formatDate(pack.travelDate)} - تعداد مسافران: {pack.passengers.length}/{pack.type === 'vip' ? 25 : 40}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-right">
                  <thead>
                    <tr className="bg-purple-600 text-white">
                      <th className="p-3 border border-gray-300">ردیف</th>
                      <th className="p-3 border border-gray-300">نام</th>
                      <th className="p-3 border border-gray-300">نام خانوادگی</th>
                      <th className="p-3 border border-gray-300">کد ملی</th>
                      <th className="p-3 border border-gray-300">شماره موبایل</th>
                      <th className="p-3 border border-gray-300">تاریخ رفت</th>
                      <th className="p-3 border border-gray-300">تاریخ برگشت</th>
                      <th className="p-3 border border-gray-300">تاریخ تولد</th>
                      <th className="p-3 border border-gray-300">نام سرپرست</th>
                      <th className="p-3 border border-gray-300">موبایل سرپرست</th>
                      <th className="p-3 border border-gray-300">جنسیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pack.passengers.map((passenger, index) => (
                      <tr key={passenger.id} className="hover:bg-gray-100">
                        <td className="p-3 border border-gray-300">{index + 1}</td>
                        <td className="p-3 border border-gray-300">{passenger.firstName}</td>
                        <td className="p-3 border border-gray-300">{passenger.lastName}</td>
                        <td className="p-3 border border-gray-300">{passenger.nationalCode}</td>
                        <td className="p-3 border border-gray-300">{passenger.phone}</td>
                        <td className="p-3 border border-gray-300">{formatDate(passenger.travelDate)}</td>
                        <td className="p-3 border border-gray-300">
                          {passenger.returnDate ? formatDate(passenger.returnDate) : '-'}
                        </td>
                        <td className="p-3 border border-gray-300">
                          {passenger.birthDate ? formatDate(passenger.birthDate) : '-'}
                        </td>
                        <td className="p-3 border border-gray-300">{passenger.leaderName || '-'}</td>
                        <td className="p-3 border border-gray-300">{passenger.leaderPhone || '-'}</td>
                        <td className="p-3 border border-gray-300">
                          {passenger.gender === 'unknown' ? 'نامشخص' : passenger.gender}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pack.busAssignment && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-purple-600 mb-2">اطلاعات اتوبوس</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-right">
                      <thead>
                        <tr className="bg-purple-600 text-white">
                          <th className="p-3 border border-gray-300">شرکت</th>
                          <th className="p-3 border border-gray-300">پلاک</th>
                          <th className="p-3 border border-gray-300">راننده</th>
                          <th className="p-3 border border-gray-300">موبایل راننده</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-yellow-100">
                          <td className="p-3 border border-gray-300">{pack.busAssignment.company}</td>
                          <td className="p-3 border border-gray-300">{pack.busAssignment.plate}</td>
                          <td className="p-3 border border-gray-300">{pack.busAssignment.driver}</td>
                          <td className="p-3 border border-gray-300">{pack.busAssignment.driverPhone}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-purple-600 mb-2">اطلاعات تأیید</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-right">
                    <thead>
                      <tr className="bg-purple-600 text-white">
                        <th className="p-3 border border-gray-300">نام دستگاه</th>
                        <th className="p-3 border border-gray-300">نام و نام خانوادگی مسئول</th>
                        <th className="p-3 border border-gray-300">محل امضا</th>
                        <th className="p-3 border border-gray-300">توضیحات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(4)].map((_, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="p-3 border border-gray-300">-</td>
                          <td className="p-3 border border-gray-300">-</td>
                          <td className="p-3 border border-gray-300">-</td>
                          <td className="p-3 border border-gray-300">-</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                onClick={() => setShowReturnConfirm(pack.id)}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                برگشت به مرحله قبل
              </button>
            </div>
          ))}
        </div>
      )}

      {showReturnConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-center mb-4">آیا مطمئن هستید که می‌خواهید به مرحله قبل برگردید؟</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleRevert(showReturnConfirm)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                بله
              </button>
              <button
                onClick={() => setShowReturnConfirm(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                خیر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalConfirmation;