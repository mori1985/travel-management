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
  };
}

const SmsReport = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  useEffect(() => {
    const fetchSmsDetailedReport = async () => {
      try {
        const response = await axios.get('http://localhost:3001/sms-detailed-report');
        const data = response.data;
        console.log('Received SMS detailed report:', data);
        if (!data || data.length === 0) {
          alert('داده‌ای برای نمایش گزارشات ریز پیامک‌ها وجود ندارد.');
          return;
        }
        setPacks(data);
      } catch (err) {
        console.error('Error fetching SMS detailed report:', err);
        alert('خطا در بارگذاری گزارشات ریز پیامک‌ها: ' + (err.message || 'خطای ناشناخته'));
      }
    };

    fetchSmsDetailedReport();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-purple-200 p-6">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">گزارشات ریز پیامک‌ها</h1>
      {packs.length > 0 ? (
        <div className="space-y-6">
          {packs.map((pack) => (
            <div key={pack.id} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                پک {pack.type === 'vip' ? 'VIP' : 'عادی'} - کد: {pack.id} - تاریخ: {pack.travelDate}
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
                          {passenger.smsStatus || 'نرفته'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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