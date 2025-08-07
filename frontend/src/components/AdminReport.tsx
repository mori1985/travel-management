import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ManagerialData {
  passengersByDate: { labels: string[]; datasets: { data: number[]; backgroundColor: string }[] };
  packsByType: { labels: string[]; datasets: { data: number[]; backgroundColor: string[] }[] };
  genderDistribution: { labels: string[]; datasets: { data: number[]; backgroundColor: string[] }[] };
  ageRange: { labels: string[]; datasets: { data: number[]; backgroundColor: string }[] };
  companies: { labels: string[]; datasets: { data: number[]; backgroundColor: string[] }[] };
  buses: { labels: string[]; datasets: { data: number[]; backgroundColor: string }[] };
}

const AdminReport = () => {
  const [managerialData, setManagerialData] = useState<ManagerialData>({
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
    const fetchManagerialData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/admin/report');
        const data = response.data;
        if (!data || Object.keys(data).length === 0) {
          alert('داده‌ای برای نمایش گزارشات مدیریتی وجود ندارد.');
          return;
        }
        setManagerialData({
          passengersByDate: {
            labels: data.passengersByDate?.map((item: { travelDate?: string; count?: number }) => item.travelDate || 'بدون تاریخ') || [],
            datasets: [{ data: data.passengersByDate?.map((item: { travelDate?: string; count?: number }) => item.count || 0) || [], backgroundColor: '#6b21a8' }],
          },
          packsByType: {
            labels: data.packsByType?.map((item: { type?: string; count?: number }) => item.type || 'نامشخص') || [],
            datasets: [{ data: data.packsByType?.map((item: { type?: string; count?: number }) => item.count || 0) || [], backgroundColor: ['#6b21a8', '#c084fc'] }],
          },
          genderDistribution: {
            labels: data.genderDistribution?.map((item: { gender?: string; percentage?: number }) => item.gender || 'نامشخص') || [],
            datasets: [{ data: data.genderDistribution?.map((item: { gender?: string; percentage?: number }) => item.percentage || 0) || [], backgroundColor: ['#6b21a8', '#c084fc'] }],
          },
          ageRange: {
            labels: data.ageRange?.map((item: { age_range?: string; count?: number }) => item.age_range || 'بدون رنج') || [],
            datasets: [{ data: data.ageRange?.map((item: { age_range?: string; count?: number }) => item.count || 0) || [], backgroundColor: '#6b21a8' }],
          },
          companies: {
            labels: data.companies?.map((item: { company?: string; count?: number }) => item.company || 'نامشخص') || [],
            datasets: [{ data: data.companies?.map((item: { company?: string; count?: number }) => item.count || 0) || [], backgroundColor: ['#6b21a8', '#c084fc', '#34d399', '#facc15'] }],
          },
          buses: {
            labels: data.buses?.map((item: { plate?: string; count?: number }) => item.plate || 'بدون پلاک') || [],
            datasets: [{ data: data.buses?.map((item: { plate?: string; count?: number }) => item.count || 0) || [], backgroundColor: '#6b21a8' }],
          },
        });
      } catch (err: any) {
        console.error('Error fetching managerial report data:', err);
        alert('خطا در بارگذاری گزارشات مدیریتی: ' + (err.message || 'خطای ناشناخته'));
      }
    };

    fetchManagerialData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '' },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-purple-200 p-6">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">گزارشات</h1>
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => {}}
          className="relative px-6 py-3 rounded-lg text-white font-semibold text-lg transition-all duration-300 bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 animate-glow"
          style={{ animation: 'glow 1.5s ease-in-out infinite alternate', boxShadow: '0 0 15px rgba(107, 33, 168, 0.7)' }}
        >
          گزارشات مدیریتی
          <style>{`@keyframes glow { from { box-shadow: 0 0 10px rgba(107, 33, 168, 0.5), 0 0 20px rgba(107, 33, 168, 0.3); } to { box-shadow: 0 0 20px rgba(107, 33, 168, 0.8), 0 0 30px rgba(107, 33, 168, 0.5); } }`}</style>
        </button>
        <button
          onClick={() => navigate('/sms-report')}
          className="relative px-6 py-3 rounded-lg text-white font-semibold text-lg transition-all duration-300 bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 animate-glow"
          style={{ animation: 'glow-emerald 1.5s ease-in-out infinite alternate', boxShadow: '0 0 15px rgba(16, 185, 129, 0.7)' }}
        >
          گزارشات ریز پیامک‌ها
          <style>{`@keyframes glow-emerald { from { box-shadow: 0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3); } to { box-shadow: 0 0 20px rgba(16, 185, 129, 0.8), 0 0 30px rgba(16, 185, 129, 0.5); } }`}</style>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">تعداد مسافران به‌ازای هر روز</h2>
          {managerialData.passengersByDate.labels.length > 0 ? (
            <Bar data={managerialData.passengersByDate} options={{ ...options, plugins: { title: { text: 'تعداد مسافران در تاریخ‌های مختلف' } } }} />
          ) : <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد.</p>}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">توزیع پک‌ها (عادی و VIP)</h2>
          {managerialData.packsByType.labels.length > 0 ? (
            <Pie data={managerialData.packsByType} options={{ ...options, plugins: { title: { text: 'توزیع پک‌ها (عادی، VIP)' } } }} />
          ) : <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد.</p>}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">توزیع جنسیت</h2>
          {managerialData.genderDistribution.labels.length > 0 ? (
            <Pie data={managerialData.genderDistribution} options={{ ...options, plugins: { title: { text: 'توزیع جنسیت (زن، مرد، نامشخص)' } } }} />
          ) : <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد.</p>}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">رنج سنی مسافران</h2>
          {managerialData.ageRange.labels.length > 0 ? (
            <Bar data={managerialData.ageRange} options={{ ...options, plugins: { title: { text: 'رنج سنی مسافران (0-5، 6-10، 11-15، ...)' } } }} />
          ) : <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد.</p>}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">توزیع شرکت‌ها</h2>
          {managerialData.companies.labels.length > 0 ? (
            <Pie data={managerialData.companies} options={{ ...options, plugins: { title: { text: 'توزیع شرکت‌ها (مانند شرکت ایران‌پیما)' } } }} />
          ) : <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد.</p>}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">تعداد پک‌ها به‌ازای هر اتوبوس</h2>
          {managerialData.buses.labels.length > 0 ? (
            <Bar data={managerialData.buses} options={{ ...options, plugins: { title: { text: 'تعداد پک‌ها به‌ازای هر اتوبوس (مانند 888-ع-88)' } } }} />
          ) : <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminReport;