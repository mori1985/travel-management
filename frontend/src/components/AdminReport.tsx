import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Bar,
  Pie,
  Line,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AdminReport = () => {
  const [reportData, setReportData] = useState({
    passengersByDate: { labels: [], datasets: [{ data: [], backgroundColor: '#6b21a8' }] },
    packsByType: { labels: [], datasets: [{ data: [], backgroundColor: ['#6b21a8', '#c084fc'] }] },
    genderDistribution: { labels: [], datasets: [{ data: [], backgroundColor: ['#6b21a8', '#c084fc'] }] },
    ageRange: { labels: [], datasets: [{ data: [], backgroundColor: '#6b21a8' }] },
    companies: { labels: [], datasets: [{ data: [], backgroundColor: ['#6b21a8', '#c084fc', '#34d399', '#facc15'] }] },
    buses: { labels: [], datasets: [{ data: [], backgroundColor: '#6b21a8' }] },
  });
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/admin/report');
        const data = response.data;
        console.log('Received report data:', data);
        if (!data || Object.keys(data).length === 0) {
          alert('داده‌ای برای نمایش وجود ندارد.');
          return;
        }
        setReportData({
          passengersByDate: {
            labels: data.passengersByDate?.map((item) => item.travelDate || 'بدون تاریخ') || [],
            datasets: [{ data: data.passengersByDate?.map((item) => item.count || 0) || [], backgroundColor: '#6b21a8' }],
          },
          packsByType: {
            labels: data.packsByType?.map((item) => item.type || 'نامشخص') || [],
            datasets: [{ data: data.packsByType?.map((item) => item.count || 0) || [], backgroundColor: ['#6b21a8', '#c084fc'] }],
          },
          genderDistribution: {
            labels: data.genderDistribution?.map((item) => item.gender || 'نامشخص') || [],
            datasets: [{ data: data.genderDistribution?.map((item) => item.percentage || 0) || [], backgroundColor: ['#6b21a8', '#c084fc'] }],
          },
          ageRange: {
            labels: data.ageRange?.map((item) => item.age_range || 'بدون رنج') || [],
            datasets: [{ data: data.ageRange?.map((item) => item.count || 0) || [], backgroundColor: '#6b21a8' }],
          },
          companies: {
            labels: data.companies?.map((item) => item.company || 'نامشخص') || [],
            datasets: [{ data: data.companies?.map((item) => item.count || 0) || [], backgroundColor: ['#6b21a8', '#c084fc', '#34d399', '#facc15'] }],
          },
          buses: {
            labels: data.buses?.map((item) => item.plate || 'بدون پلاک') || [],
            datasets: [{ data: data.buses?.map((item) => item.count || 0) || [], backgroundColor: '#6b21a8' }],
          },
        });
      } catch (err) {
        console.error('Error fetching report data:', err);
        alert('خطا در بارگذاری گزارش: ' + (err.message || 'خطای ناشناخته'));
      }
    };

    fetchReportData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '' },
    },
  };

  // تابع برای هدایت به صفحه ارسال پیامک
  const handleSendSms = (packId: number) => {
    navigate(`/send-sms/${packId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-purple-200 p-6">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">گزارشات</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">تعداد مسافران به‌ازای هر روز</h2>
          {reportData.passengersByDate.labels.length > 0 ? (
            <>
              <Bar data={reportData.passengersByDate} options={{ ...options, plugins: { title: { text: 'تعداد مسافران در تاریخ‌های مختلف' } } }} />

            </>
          ) : (
            <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">توزیع پک‌ها (عادی و VIP)</h2>
          {reportData.packsByType.labels.length > 0 ? (
            <Pie data={reportData.packsByType} options={{ ...options, plugins: { title: { text: 'توزیع پک‌ها (عادی، VIP)' } } }} />
          ) : (
            <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">توزیع جنسیت</h2>
          {reportData.genderDistribution.labels.length > 0 ? (
            <Pie data={reportData.genderDistribution} options={{ ...options, plugins: { title: { text: 'توزیع جنسیت (زن، مرد، نامشخص)' } } }} />
          ) : (
            <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">رنج سنی مسافران</h2>
          {reportData.ageRange.labels.length > 0 ? (
            <Bar data={reportData.ageRange} options={{ ...options, plugins: { title: { text: 'رنج سنی مسافران (0-5، 6-10، 11-15، ...)' } } }} />
          ) : (
            <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">توزیع شرکت‌ها</h2>
          {reportData.companies.labels.length > 0 ? (
            <Pie data={reportData.companies} options={{ ...options, plugins: { title: { text: 'توزیع شرکت‌ها (مانند شرکت ایران‌پیما)' } } }} />
          ) : (
            <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">تعداد پک‌ها به‌ازای هر اتوبوس</h2>
          {reportData.buses.labels.length > 0 ? (
            <Bar data={reportData.buses} options={{ ...options, plugins: { title: { text: 'تعداد پک‌ها به‌ازای هر اتوبوس (مانند 888-ع-88)' } } }} />
          ) : (
            <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReport;