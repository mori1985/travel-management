import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  smsStatus?: string;
}

interface Pack {
  id: number;
  travelDate: string;
  type: 'normal' | 'vip';
  status: 'pending' | 'assigned' | 'confirmed';
  passengers: Passenger[];
  busAssignment?: {
    company: string;
    plate: string;
    driver: string;
    driverPhone: string;
    driverSmsStatus?: string;
  };
  leaderSmsStatus?: string;
}

const SmsReport = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [openPackId, setOpenPackId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  useEffect(() => {
    console.log('Current role:', role);
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  useEffect(() => {
    const fetchSmsDetailedReport = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/sms-detailed-report');
        const data = response.data;
        console.log('Received SMS detailed report:', data);
        if (!data || data.length === 0) {
          alert('داده‌ای برای نمایش گزارشات ریز پیامک‌ها وجود ندارد.');
          return;
        }
        setPacks(data);
      } catch (err: any) {
        console.error('Error fetching SMS detailed report:', err.response?.data || err.message);
        alert('خطا در بارگذاری گزارشات ریز پیامک‌ها: ' + (err.response?.data?.message || err.message || 'خطای ناشناخته'));
      } finally {
        setLoading(false);
      }
    };

    fetchSmsDetailedReport();
  }, []);

  const renderSmsStatus = (status: string | undefined) => {
    if (!status) {
      return <span className="text-gray-500"> - </span>;
    }
    switch (status) {
      case 'ارسال شده و رسیده':
        return <span className="text-green-600 font-semibold">✔✔ رسیده</span>;
      case 'ارسال شده اما هنوز نرسیده':
        return <span className="text-orange-500 font-semibold">✔ در انتظار</span>;
      case 'ارسال با خطا مواجه شده':
        return <span className="text-red-600 font-semibold">✖ ناموفق</span>;
      default:
        return <span className="text-gray-500"> - ارسال نشده</span>;
    }
  };

  const getUniqueLeaders = (passengers: Passenger[]) => {
    const leadersMap = new Map<string, { name: string; phone: string; smsStatus: string }>();
    passengers.forEach((passenger) => {
      if (passenger.leaderPhone && passenger.leaderName) {
        const smsStatus = passenger.leaderPhone ? (packs
          .find(pack => pack.passengers.some(p => p.phone === passenger.phone))
          ?.leaderSmsStatus?.split(', ')
          ?.find((_, index) => leadersMap.size === index) || 'تا کنون پیامکی ارسال نشده') : 'تا کنون پیامکی ارسال نشده';
        leadersMap.set(passenger.leaderPhone, {
          name: passenger.leaderName,
          phone: passenger.leaderPhone,
          smsStatus,
        });
      }
    });
    return Array.from(leadersMap.values());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <svg className="animate-spin h-8 w-8 text-purple-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-purple-200 p-6">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">گزارشات ریز پیامک‌ها</h1>
      {packs.length > 0 ? (
        <div className="space-y-4">
          {packs.map((pack) => (
            <div key={pack.id} className="bg-white rounded-lg shadow-lg">
              <button
                onClick={() => setOpenPackId(openPackId === pack.id ? null : pack.id)}
                className="w-full text-right p-4 bg-purple-600 text-white rounded-t-lg hover:bg-purple-700 transition duration-300 flex justify-between items-center"
              >
                <span className="text-lg font-semibold">
                  پک {pack.type === 'vip' ? 'VIP' : 'عادی'} - کد: {pack.id} - تاریخ: {pack.travelDate}
                </span>
                <span className="text-xl">{openPackId === pack.id ? '▲' : '▼'}</span>
              </button>
              {openPackId === pack.id && (
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-600 mb-4">اطلاعات راننده و شرکت</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-right">
                        <thead>
                          <tr className="bg-purple-600 text-white">
                            <th className="p-3 border border-gray-300">نام راننده</th>
                            <th className="p-3 border border-gray-300">شماره راننده</th>
                            <th className="p-3 border border-gray-300">شرکت</th>
                            <th className="p-3 border border-gray-300">پلاک</th>
                            <th className="p-3 border border-gray-300">وضعیت پیامک راننده</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-gray-100">
                            <td className="p-3 border border-gray-300">{pack.busAssignment?.driver || '-'}</td>
                            <td className="p-3 border border-gray-300">{pack.busAssignment?.driverPhone || '-'}</td>
                            <td className="p-3 border border-gray-300">{pack.busAssignment?.company || '-'}</td>
                            <td className="p-3 border border-gray-300">{pack.busAssignment?.plate || '-'}</td>
                            <td className="p-3 border border-gray-300">
                              {renderSmsStatus(pack.busAssignment?.driverSmsStatus)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-600 mb-4">اطلاعات مسئولین</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-right">
                        <thead>
                          <tr className="bg-purple-600 text-white">
                            <th className="p-3 border border-gray-300">ردیف</th>
                            <th className="p-3 border border-gray-300">نام مسئول</th>
                            <th className="p-3 border border-gray-300">شماره مسئول</th>
                            <th className="p-3 border border-gray-300">وضعیت پیامک</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getUniqueLeaders(pack.passengers).length > 0 ? (
                            getUniqueLeaders(pack.passengers).map((leader, index) => (
                              <tr key={leader.phone} className="hover:bg-gray-100">
                                <td className="p-3 border border-gray-300">{index + 1}</td>
                                <td className="p-3 border border-gray-300">{leader.name}</td>
                                <td className="p-3 border border-gray-300">{leader.phone}</td>
                                <td className="p-3 border border-gray-300">
                                  {renderSmsStatus(leader.smsStatus)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="p-3 text-center text-gray-500">
                                هیچ مسئولی تعیین نشده است.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-600 mb-4">اطلاعات مسافران</h3>
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
                            <th className="p-3 border border-gray-300">وضعیت پیامک</th>
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
                              <td className="p-3 border border-gray-300">{passenger.travelDate}</td>
                              <td className="p-3 border border-gray-300">{passenger.returnDate || '-'}</td>
                              <td className="p-3 border border-gray-300">
                                {renderSmsStatus(passenger.smsStatus)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">هیچ پکی برای نمایش وجود ندارد.</p>
      )}
    </div>
  );
};

export default SmsReport;