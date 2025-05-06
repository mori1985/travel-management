import { useState } from 'react';
import axios from '../axiosConfig'; // تغییر به axiosInstance
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import 'react-multi-date-picker/styles/layouts/mobile.css';
import { FaUserPlus } from 'react-icons/fa';

const CreateVipPassenger = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalCode: '',
    mobile: '',
    departureDate: null as any,
    returnDate: null as any,
    birthDate: null as any,
    guardianFirstName: '',
    guardianLastName: '',
    guardianMobile: '',
    travelType: 'individual' as 'individual' | 'group',
    vipServices: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    nationalCode: '',
    mobile: '',
    departureDate: '',
    birthDate: '',
  });
  const [nationalCodeError, setNationalCodeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name: string, value: string | any) => {
    switch (name) {
      case 'firstName':
        if (value.length < 3) {
          return 'نام باید حداقل ۳ حرف باشد';
        }
        return '';
      case 'lastName':
        if (value.length < 3) {
          return 'نام خانوادگی باید حداقل ۳ حرف باشد';
        }
        return '';
      case 'nationalCode':
        if (!/^\d{10}$/.test(value)) {
          return 'کد ملی باید دقیقاً ۱۰ رقم باشد';
        }
        return '';
      case 'mobile':
        if (!/^09\d{9}$/.test(value)) {
          return 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد';
        }
        return '';
      case 'departureDate':
        if (!value) {
          return 'تاریخ رفت الزامی است';
        }
        return '';
      case 'birthDate':
        if (!value) {
          return 'تاریخ تولد الزامی است';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleDateChange = (date: any, field: string) => {
    setFormData({ ...formData, [field]: date });
    setErrors({ ...errors, [field]: validateField(field, date) });
  };

  const validateNationalCode = async (nationalCode: string) => {
    if (!/^\d{10}$/.test(nationalCode)) {
      setNationalCodeError('کد ملی باید دقیقاً ۱۰ رقم باشد');
      return false;
    }
    try {
      const response = await axios.get(`/passengers/check-national-code/${nationalCode}`);
      if (response.data.exists) {
        setNationalCodeError('این کد ملی قبلاً ثبت شده است');
        return false;
      }
      setNationalCodeError('');
      return true;
    } catch (err: any) {
      setNationalCodeError('خطا در بررسی کد ملی');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      nationalCode: validateField('nationalCode', formData.nationalCode),
      mobile: validateField('mobile', formData.mobile),
      departureDate: validateField('departureDate', formData.departureDate),
      birthDate: validateField('birthDate', formData.birthDate),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== '')) {
      return;
    }

    if (!(await validateNationalCode(formData.nationalCode))) return;

    setIsLoading(true);
    try {
      await axios.post('/passengers', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        nationalCode: formData.nationalCode,
        phone: formData.mobile,
        travelDate: formData.departureDate ? formData.departureDate.format('YYYY/MM/DD') : null,
        returnDate: formData.returnDate ? formData.returnDate.format('YYYY/MM/DD') : null,
        birthDate: formData.birthDate ? formData.birthDate.format('YYYY/MM/DD') : null,
        travelType: formData.travelType === 'individual' ? 'normal' : 'vip',
        leaderName: formData.guardianFirstName,
        leaderPhone: formData.guardianMobile,
        vipServices: formData.vipServices,
        gender: 'unknown', // مقدار پیش‌فرض، چون تو فرم نیست
      });
      navigate('/passengers');
    } catch (err: any) {
      setErrors({ ...errors, general: `خطا در ثبت: ${err.response?.data?.message || err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-purple-200 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all hover:scale-105 animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">ثبت مسافر VIP</h2>
        {errors.general && <p className="text-red-500 mb-4 text-center">{errors.general}</p>}
        {nationalCodeError && <p className="text-red-500 mb-4 text-center">{nationalCodeError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="firstName">
              نام
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              required
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1 text-right">{errors.firstName}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="lastName">
              نام خانوادگی
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              required
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1 text-right">{errors.lastName}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="nationalCode">
              کد ملی
            </label>
            <input
              type="text"
              id="nationalCode"
              name="nationalCode"
              value={formData.nationalCode}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              required
            />
            {errors.nationalCode && <p className="text-red-500 text-sm mt-1 text-right">{errors.nationalCode}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="mobile">
              شماره موبایل
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              required
            />
            {errors.mobile && <p className="text-red-500 text-sm mt-1 text-right">{errors.mobile}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="departureDate">
              تاریخ رفت
            </label>
            <DatePicker
              value={formData.departureDate}
              onChange={(date: any) => handleDateChange(date, 'departureDate')}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD"
              inputClass="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              placeholder="انتخاب تاریخ (مثال: 1404/02/13)"
              required
            />
            {errors.departureDate && <p className="text-red-500 text-sm mt-1 text-right">{errors.departureDate}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="returnDate">
              تاریخ برگشت
            </label>
            <DatePicker
              value={formData.returnDate}
              onChange={(date: any) => handleDateChange(date, 'returnDate')}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD"
              inputClass="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              placeholder="انتخاب تاریخ (مثال: 1404/02/13)"
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="birthDate">
              تاریخ تولد
            </label>
            <DatePicker
              value={formData.birthDate}
              onChange={(date: any) => handleDateChange(date, 'birthDate')}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD"
              inputClass="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              placeholder="انتخاب تاریخ (مثال: 1404/02/13)"
              required
            />
            {errors.birthDate && <p className="text-red-500 text-sm mt-1 text-right">{errors.birthDate}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="guardianFirstName">
              نام سرپرست
            </label>
            <input
              type="text"
              id="guardianFirstName"
              name="guardianFirstName"
              value={formData.guardianFirstName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="guardianLastName">
              نام خانوادگی سرپرست
            </label>
            <input
              type="text"
              id="guardianLastName"
              name="guardianLastName"
              value={formData.guardianLastName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="guardianMobile">
              موبایل سرپرست
            </label>
            <input
              type="text"
              id="guardianMobile"
              name="guardianMobile"
              value={formData.guardianMobile}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="travelType">
              نوع سفر
            </label>
            <select
              id="travelType"
              name="travelType"
              value={formData.travelType}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              required
            >
              <option value="individual">انفرادی</option>
              <option value="group">گروهی</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="vipServices">
              خدمات VIP
            </label>
            <textarea
              id="vipServices"
              name="vipServices"
              value={formData.vipServices}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              rows={4}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <FaUserPlus className="ml-2" />
            )}
            {isLoading ? 'در حال ثبت...' : 'ثبت'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateVipPassenger;