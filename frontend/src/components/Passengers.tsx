import { useState } from 'react';
import { axiosInstance } from '../axiosConfig';
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
  smsStatus?: string;
}

const PassengerSearch = () => {
  const [nationalCode, setNationalCode] = useState('');
  const [passenger, setPassenger] = useState<Passenger | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false); // اضافه کردن isLoading
  //const { token } = useContext(AuthContext);

  const handleSearch = async () => {
    if (!nationalCode || nationalCode.length !== 10) {
      setError('لطفاً کد ملی ۱۰ رقمی معتبر وارد کنید');
      return;
    }
    setError('');
    setSuccess('');
    setIsLoading(true); // استفاده از isLoading
    try {
      const response = await axiosInstance.get(`/passengers/search?nationalCode=${nationalCode}`);
      console.log('Search response:', response.data);
      setPassenger(response.data);
      setSuccess('جستجو با موفقیت انجام شد!');
    } catch (err: any) {
      console.error('Search passenger error:', err);
      setPassenger(null);
      setError(err.message === 'چنین آدرسی وجود ندارد' ? 'چنین آدرسی وجود ندارد' : 'مسافری با این کد ملی یافت نشد یا خطایی رخ داد.');
    } finally {
      setIsLoading(false); // استفاده از isLoading
    }
  };

  const handleClear = () => {
    setNationalCode('');
    setPassenger(null);
    setError('');
    setSuccess('');
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    const cleanDate = date.split('T')[0];
    return moment(cleanDate, 'jYYYY-jMM-jDD').locale('fa').format('jD MMMM jYYYY');
  };

  const renderSmsStatus = (status: string | undefined) => {
    if (!status) return <span className="text-gray-500"> - </span>;
    switch (status) {
      case 'ارسال شده و رسیده': return <span className="text-green-600 font-semibold">✔✔ رسیده</span>;
      case 'ارسال شده اما هنوز نرسیده': return <span className="text-orange-500 font-semibold">✔ در انتظار</span>;
      case 'ارسال با خطا مواجه شده': return <span className="text-red-600 font-semibold">✖ ناموفق</span>;
      default: return <span className="text-gray-500"> - ارسال نشده</span>;
    }
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex justify-center items-center">
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-800">🔍 جستجوی مسافر</h2>

      <div>
        <label className="block text-right text-gray-700 font-medium mb-1">کد ملی (۱۰ رقمی)</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={nationalCode}
            onChange={(e) => setNationalCode(e.target.value.replace(/[^0-9]/g, ''))}
            maxLength={10}
            placeholder="مثلاً: ۱۲۳۴۵۶۷۸۹۰"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-right text-gray-800 transition"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className={`px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold shadow hover:shadow-xl transition-all ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'
            }`}
          >
            {isLoading ? 'در حال جستجو...' : 'جستجو'}
          </button>
        </div>
        {error && <p className="text-red-600 text-right mt-2">{error}</p>}
        {success && <p className="text-green-600 text-right mt-2">{success}</p>}
      </div>

      {passenger ? (
        <div className="bg-gray-50 p-6 rounded-xl shadow-md space-y-4">
          <h3 className="text-xl font-semibold text-blue-700 text-right">📋 اطلاعات مسافر</h3>

          <div className="overflow-x-auto hidden md:block">
            <table className="w-full border-collapse text-right table-auto text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 border border-gray-300">شناسه</th>
                  <th className="p-3 border border-gray-300">نام</th>
                  <th className="p-3 border border-gray-300">نام خانوادگی</th>
                  <th className="p-3 border border-gray-300">کد ملی</th>
                  <th className="p-3 border border-gray-300">تلفن</th>
                  <th className="p-3 border border-gray-300">نوع پک</th>
                  <th className="p-3 border border-gray-300">شناسه پک</th>
                  <th className="p-3 border border-gray-300">تاریخ رفت</th>
                  <th className="p-3 border border-gray-300">تاریخ برگشت</th>
                  <th className="p-3 border border-gray-300">تاریخ تولد</th>
                  <th className="p-3 border border-gray-300">وضعیت</th>
                  <th className="p-3 border border-gray-300">پیامک</th>
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
                  <td className="p-3 border border-gray-300">{renderSmsStatus(passenger.smsStatus)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* نمایش کارت در موبایل */}
          <div className="md:hidden space-y-2 text-right text-sm">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <span className="font-semibold">شناسه:</span> <span>{passenger.id}</span>
              <span className="font-semibold">نام:</span> <span>{passenger.firstName}</span>
              <span className="font-semibold">نام خانوادگی:</span> <span>{passenger.lastName}</span>
              <span className="font-semibold">کد ملی:</span> <span>{passenger.nationalCode}</span>
              <span className="font-semibold">تلفن:</span> <span>{passenger.phone}</span>
              <span className="font-semibold">نوع پک:</span> <span>{passenger.travelType === 'vip' ? 'VIP' : 'عادی'}</span>
              <span className="font-semibold">شناسه پک:</span> <span>{passenger.packId || '-'}</span>
              <span className="font-semibold">تاریخ رفت:</span> <span>{formatDate(passenger.travelDate)}</span>
              <span className="font-semibold">تاریخ برگشت:</span> <span>{formatDate(passenger.returnDate)}</span>
              <span className="font-semibold">تاریخ تولد:</span> <span>{formatDate(passenger.birthDate)}</span>
              <span className="font-semibold">وضعیت:</span> <span>{passenger.stageText}</span>
              <span className="font-semibold">پیامک:</span> <span>{renderSmsStatus(passenger.smsStatus)}</span>
            </div>
          </div>
        </div>
      ) : (
        !error && !isLoading && (
          <p className="text-center text-gray-500">لطفاً کد ملی را وارد کرده و جستجو نمایید.</p>
        )
      )}

      <div className="flex justify-end">
        <button
          onClick={handleClear}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white font-bold shadow hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          پاک کردن
        </button>
      </div>
    </div>
  </div>
);

};

export default PassengerSearch;