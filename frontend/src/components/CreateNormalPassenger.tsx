import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import moment from 'jalali-moment';
import 'react-datepicker/dist/react-datepicker.css';

const CreateNormalPassenger = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    mobile: '',
    nationalCode: '',
    departureDate: null as Date | null,
    returnDate: null as Date | null,
    birthDate: null as Date | null,
    tripType: 'normal',
    guardianName: '',
    guardianMobile: '',
  });
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | null, field: string) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // چک یونیک بودن کد ملی (فعلاً فرضی)
      const nationalCodeCheck = await axios.get(
        `http://localhost:3000/passengers/check-national-code/${formData.nationalCode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!nationalCodeCheck.data.isUnique) {
        setError('کد ملی قبلاً ثبت شده است.');
        return;
      }

      // آماده‌سازی دیتا برای ارسال
      const payload = {
        ...formData,
        departureDate: formData.departureDate
          ? moment(formData.departureDate).locale('fa').format('YYYY-MM-DD')
          : null,
        returnDate: formData.returnDate
          ? moment(formData.returnDate).locale('fa').format('YYYY-MM-DD')
          : null,
        birthDate: formData.birthDate
          ? moment(formData.birthDate).locale('fa').format('YYYY-MM-DD')
          : null,
      };

      // ارسال به بک‌اند
      await axios.post('http://localhost:3000/passengers', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/passengers');
    } catch (err: any) {
      console.error('Create passenger error:', err.response?.data || err.message);
      setError('خطا در ثبت مسافر. لطفاً دوباره تلاش کنید.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">ثبت مسافر عادی</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="firstName">
              نام
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-right"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="lastName">
              نام خانوادگی
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-right"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="gender">
              جنسیت
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-right"
              required
            >
              <option value="">انتخاب کنید</option>
              <option value="male">مرد</option>
              <option value="female">زن</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="mobile">
              شماره موبایل
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-right"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="nationalCode">
              کد ملی
            </label>
            <input
              type="text"
              id="nationalCode"
              name="nationalCode"
              value={formData.nationalCode}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-right"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="departureDate">
              تاریخ رفت
            </label>
            <DatePicker
              selected={formData.departureDate}
              onChange={(date: Date | null) => handleDateChange(date, 'departureDate')}
              dateFormat="yyyy/MM/dd"
              calendar="jalali"
              locale="fa"
              className="w-full p-2 border rounded-lg text-right"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="returnDate">
              تاریخ برگشت
            </label>
            <DatePicker
              selected={formData.returnDate}
              onChange={(date: Date | null) => handleDateChange(date, 'returnDate')}
              dateFormat="yyyy/MM/dd"
              calendar="jalali"
              locale="fa"
              className="w-full p-2 border rounded-lg text-right"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="birthDate">
              تاریخ تولد
            </label>
            <DatePicker
              selected={formData.birthDate}
              onChange={(date: Date | null) => handleDateChange(date, 'birthDate')}
              dateFormat="yyyy/MM/dd"
              calendar="jalali"
              locale="fa"
              className="w-full p-2 border rounded-lg text-right"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="guardianName">
              نام و نام خانوادگی سرپرست (اختیاری)
            </label>
            <input
              type="text"
              id="guardianName"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-right"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="guardianMobile">
              موبایل سرپرست (اختیاری)
            </label>
            <input
              type="tel"
              id="guardianMobile"
              name="guardianMobile"
              value={formData.guardianMobile}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-right"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            ثبت مسافر
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNormalPassenger;