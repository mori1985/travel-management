import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosConfig';
import moment from 'jalali-moment';
import { FaChevronDown, FaChevronUp, FaFileExcel, FaPrint } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import SendSMS from './SendSMS';

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

interface SmsMessage {
  id: number;
  recipientPhone: string;
  recipientType: string;
  text: string;
  sentAt: string;
  status: string;
}

const FinalConfirmation = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'normal' | 'vip'>('all');
  const [showReturnConfirm, setShowReturnConfirm] = useState<number | null>(null);
  const [showSendSMSModal, setShowSendSMSModal] = useState<number | null>(null);
  const [expandedPack, setExpandedPack] = useState<number | null>(null);
  const [smsReport, setSmsReport] = useState<{ count: number; messages: SmsMessage[] } | null>(null);
  const [loading, setLoadingLocal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        setLoadingLocal(true);
        const response = await axiosInstance.get('/final-confirmation');
        console.log('Fetched packs in FinalConfirmation:', response.data);
        if (Array.isArray(response.data)) {
          setPacks(response.data);
        } else {
          console.warn('Response data is not an array:', response.data);
          setPacks([]);
        }
      } catch (err: any) {
        console.error('Error fetching packs:', err);
        alert('خطا در بارگذاری پک‌ها: ' + (err.message === 'چنین آدرسی وجود ندارد' ? 'چنین آدرسی وجود ندارد' : err.response?.data?.message || err.message));
        setPacks([]);
      } finally {
        setLoadingLocal(false);
      }
    };

    fetchPacks();

    const initialPack = location.state?.updatedPack;
    if (initialPack) {
      console.log('Initial pack from location.state:', initialPack);
      setPacks((prevPacks) => {
        const packExists = prevPacks.some((p) => p.id === initialPack.id);
        if (packExists) {
          return prevPacks.map((p) => (p.id === initialPack.id ? initialPack : p));
        }
        return [...prevPacks, initialPack].filter((p) => p !== undefined);
      });
    }
  }, [location.state]);

  const fetchSmsReport = async (packId: number) => {
    try {
      setLoadingLocal(true);
      const response = await axiosInstance.get(`/sms/report/${packId}`);
      setSmsReport(response.data);
    } catch (err: any) {
      console.error('Error fetching SMS report:', err);
      setSmsReport({ count: 0, messages: [] });
    } finally {
      setLoadingLocal(false);
    }
  };

  const handleRevert = async (packId: number) => {
    try {
      setLoadingLocal(true);
      const response = await axiosInstance.post(`/packs/previous-stage/${packId}`);
      console.log('Revert response:', response.data);
      setPacks((prevPacks) => prevPacks.filter((p) => p.id !== packId));
      setShowReturnConfirm(null);
      navigate('/bus-assignment', { state: { packId } });
    } catch (err: any) {
      console.error('Error reverting pack:', err);
      alert('خطا در بازگشت به مرحله قبل: ' + (err.message === 'چنین آدرسی وجود ندارد' ? 'چنین آدرسی وجود ندارد' : err.response?.data?.message || err.message));
    } finally {
      setLoadingLocal(false);
    }
  };

  const handleSendSMS = async (packId: number) => {
    try {
      setLoadingLocal(true);
      const response = await axiosInstance.post(`/final-confirmation/send-sms/${packId}`);
      console.log('SMS sent response:', response.data);
      alert('پیامک با موفقیت ارسال شد');
      setShowSendSMSModal(null);
      await fetchSmsReport(packId);
    } catch (err: any) {
      console.error('Error sending SMS:', err);
      alert('خطا در ارسال پیامک: ' + (err.message === 'چنین آدرسی وجود ندارد' ? 'چنین آدرسی وجود ندارد' : err.response?.data?.message || err.message));
    } finally {
      setLoadingLocal(false);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    const cleanDate = date.split('T')[0];
    return moment(cleanDate, 'jYYYY-jMM-jDD').locale('fa').format('jD MMMM jYYYY');
  };

  const generateExcel = (pack: Pack) => {
    const sheetData: any[] = [];
    sheetData.push({ ' ': `گزارش پک ${pack.type === 'vip' ? 'VIP' : 'عادی'} - کد: ${pack.id}` });
    sheetData.push({ ' ': `تولید شده در: ${moment().locale('fa').format('jYYYY/jMM/jDD - HH:mm:ss')}` });
    sheetData.push({});
    sheetData.push({ ' ': 'جدول مسافران' });
    sheetData.push({
      ردیف: 'ردیف', نام: 'نام', 'نام خانوادگی': 'نام خانوادگی', 'کد ملی': 'کد ملی', 'شماره موبایل': 'شماره موبایل',
      'تاریخ رفت': 'تاریخ رفت', 'تاریخ برگشت': 'تاریخ برگشت', 'تاریخ تولد': 'تاریخ تولد',
      'نام سرپرست': 'نام سرپرست', 'موبایل سرپرست': 'موبایل سرپرست', جنسیت: 'جنسیت',
    });
    const passengersData = pack.passengers.map((passenger, index) => ({
      ردیف: index + 1,
      نام: passenger.firstName,
      'نام خانوادگی': passenger.lastName,
      'کد ملی': passenger.nationalCode,
      'شماره موبایل': passenger.phone,
      'تاریخ رفت': formatDate(passenger.travelDate),
      'تاریخ برگشت': passenger.returnDate ? formatDate(passenger.returnDate) : '-',
      'تاریخ تولد': passenger.birthDate ? formatDate(passenger.birthDate) : '-',
      'نام سرپرست': passenger.leaderName || '-',
      'موبایل سرپرست': passenger.leaderPhone || '-',
      جنسیت: passenger.gender === 'unknown' ? 'نامشخص' : passenger.gender,
    }));
    sheetData.push(...passengersData);
    sheetData.push({});
    sheetData.push({ ' ': 'اطلاعات اتوبوس' });
    sheetData.push({ شرکت: 'شرکت', پلاک: 'پلاک', راننده: 'راننده', 'موبایل راننده': 'موبایل راننده' });
    const busData = pack.busAssignment
      ? {
          شرکت: pack.busAssignment.company || '-', پلاک: pack.busAssignment.plate || '-',
          راننده: pack.busAssignment.driver || '-', 'موبایل راننده': pack.busAssignment.driverPhone || '-',
        }
      : { شرکت: '-', پلاک: '-', راننده: '-', 'موبایل راننده': '-' };
    sheetData.push(busData);
    sheetData.push({});
    sheetData.push({ ' ': 'اطلاعات دستگاه‌ها' });
    sheetData.push({
      'نام دستگاه': 'نام دستگاه', 'نام و نام خانوادگی مسئول': 'نام و نام خانوادگی مسئول',
      'محل امضا': 'محل امضا', توضیحات: 'توضیحات',
    });
    const devicesData = [
      { 'نام دستگاه': '-', 'نام و نام خانوادگی مسئول': '-', 'محل امضا': '-', توضیحات: '-' },
      { 'نام دستگاه': '-', 'نام و نام خانوادگی مسئول': '-', 'محل امضا': '-', توضیحات: '-' },
      { 'نام دستگاه': '-', 'نام و نام خانوادگی مسئول': '-', 'محل امضا': '-', توضیحات: '-' },
      { 'نام دستگاه': '-', 'نام و نام خانوادگی مسئول': '-', 'محل امضا': '-', توضیحات: '-' },
    ];
    sheetData.push(...devicesData);
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const columnWidths = [{ wch: 5 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 10 }];
    worksheet['!cols'] = columnWidths;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'گزارش پک');
    XLSX.writeFile(workbook, `pack_${pack.id}_report.xlsx`);
  };

 

  const filteredPacks = packs.filter((pack) =>
    filterType === 'all' ? true : pack.type === filterType
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-purple-200 p-6">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">مرحله تأیید نهایی و ارسال پیامک</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg transition duration-300 ${filterType === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          همه پک‌ها
        </button>
        <button
          onClick={() => setFilterType('vip')}
          className={`px-4 py-2 rounded-lg transition duration-300 ${filterType === 'vip' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          پک‌های VIP
        </button>
        <button
          onClick={() => setFilterType('normal')}
          className={`px-4 py-2 rounded-lg transition duration-300 ${filterType === 'normal' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          پک‌های عادی
        </button>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => navigate('/bus-assignment')}
          className="relative px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            بازگشت به تخصیص اتوبوس
          </span>
        </button>
      </div>

      {filteredPacks.length === 0 ? (
        <p className="text-center text-gray-600">هیچ پکی برای نمایش با فیلتر انتخاب‌شده موجود نیست</p>
      ) : (
        <div className="space-y-6">
          {filteredPacks.map((pack) => (
            <div key={pack.id} className="bg-white rounded-lg shadow-lg p-6">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setExpandedPack(expandedPack === pack.id ? null : pack.id)}
              >
                <h2 className="text-2xl font-semibold text-purple-600">
                  پک {pack.type === 'vip' ? 'VIP' : 'عادی'} - کد: {pack.id} - تاریخ:{' '}
                  {formatDate(pack.travelDate)} - تعداد مسافران:{' '}
                  {(pack.passengers?.length || 0)}/{pack.type === 'vip' ? 25 : 40}
                </h2>
                {expandedPack === pack.id ? (
                  <FaChevronUp className="text-purple-600" />
                ) : (
                  <FaChevronDown className="text-purple-600" />
                )}
              </div>
              {expandedPack === pack.id && (
                <>
                  <div className="overflow-x-auto mt-4">
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
                        {(pack.passengers || []).map((passenger, index) => (
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

                  {pack.busAssignment ? (
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
                              <td className="p-3 border border-gray-300">{pack.busAssignment.company || '-'}</td>
                              <td className="p-3 border border-gray-300">{pack.busAssignment.plate || '-'}</td>
                              <td className="p-3 border border-gray-300">{pack.busAssignment.driver || '-'}</td>
                              <td className="p-3 border border-gray-300">{pack.busAssignment.driverPhone || '-'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-500 mt-4">اطلاعات اتوبوس برای این پک موجود نیست</p>
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

                  <div className="mt-6 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setShowSendSMSModal(pack.id);
                          fetchSmsReport(pack.id);
                        }}
                        className="relative w-full md:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out flex items-center gap-2"
                        disabled={loading} // غیرفعال کردن دکمه در حالت لودینگ
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        ارسال پیامک و گزارشات پیامک
                      </button>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowReturnConfirm(pack.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 w-full md:w-auto"
                        disabled={loading} // غیرفعال کردن دکمه در حالت لودینگ
                      >
                        برگشت به مرحله قبل
                      </button>
                      <button
                        onClick={() => generateExcel(pack)}
                        className="relative px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out flex items-center gap-2 w-full md:w-auto"
                        disabled={loading} // غیرفعال کردن دکمه در حالت لودینگ
                      >
                        <FaFileExcel /> خروجی اکسل
                      </button>
                      <button
                        className="relative px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out flex items-center gap-2 w-full md:w-auto"
                        disabled={loading} // غیرفعال کردن دکمه در حالت لودینگ
                      >
                        <FaPrint /> پرینت
                      </button>
                    </div>
                  </div>
                </>
              )}
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
                disabled={loading} // غیرفعال کردن دکمه در حالت لودینگ
              >
                بله
              </button>
              <button
                onClick={() => setShowReturnConfirm(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                disabled={loading} // غیرفعال کردن دکمه در حالت لودینگ
              >
                خیر
              </button>
            </div>
          </div>
        </div>
      )}

      {showSendSMSModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {smsReport && smsReport.count > 0 ? (
              <div className="bg-red-500 text-white p-4 rounded-lg mb-4 text-center">
                <h3 className="text-lg font-bold">هشدار: پیامک قبلاً برای این پک ارسال شده است!</h3>
                <p className="mt-2">تعداد پیامک‌ها: {smsReport.count}</p>
                <h4 className="mt-2 font-semibold">جزییات آخرین پیامک:</h4>
                <ul className="list-disc list-inside mt-1">
                  <li>تاریخ و ساعت: {moment(smsReport.messages[0].sentAt).locale('fa').format('jD MMMM jYYYY - HH:mm:ss')}</li>
                  <li>متن: {smsReport.messages[0].text}</li>
                  <li>دریافت‌کنندگان:</li>
                  <ul className="list-disc list-inside ml-4">
                    {smsReport.messages.map((msg) => (
                      <li key={msg.id}>
                        {msg.recipientPhone} ({msg.recipientType})
                      </li>
                    ))}
                  </ul>
                </ul>
              </div>
            ) : null}
            <SendSMS
              packId={showSendSMSModal}
              onClose={() => {
                setShowSendSMSModal(null);
                setSmsReport(null);
              }}
              onSend={() => handleSendSMS(showSendSMSModal)}
              loading={loading} // پاس دادن وضعیت لودینگ به SendSMS
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalConfirmation;