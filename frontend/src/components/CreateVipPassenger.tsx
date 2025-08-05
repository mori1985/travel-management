import { useState } from 'react';
import { axiosInstance, setLoading } from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import DateSelector from './DateSelector';

const CreateVipPassenger = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalCode: '',
    mobile: '',
    departureDate: '1404-04-01',
    returnDate: '',
    birthDate: '1404-01-01',
    guardianFirstName: '',
    guardianLastName: '',
    guardianMobile: '',
    travelType: 'vip' as 'normal' | 'vip',
    gender: '' as 'مرد' | 'زن' | '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    nationalCode: '',
    mobile: '',
    departureDate: '',
    birthDate: '',
    gender: '',
    guardianFirstName: '',
    guardianLastName: '',
    guardianMobile: '',
    general: '',
  });
  const [nationalCodeError, setNationalCodeError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false); // اضافه کردن isLoading
  const navigate = useNavigate();

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'firstName':
        if (value.length < 3) return 'نام باید حداقل ۳ حرف باشد';
        return '';
      case 'lastName':
        if (value.length < 3) return 'نام خانوادگی باید حداقل ۳ حرف باشد';
        return '';
      case 'nationalCode':
        if (!/^\d{10}$/.test(value)) return 'کد ملی باید دقیقاً ۱۰ رقم باشد';
        return '';
      case 'mobile':
        if (!/^09\d{9}$/.test(value)) return 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد';
        return '';
      case 'departureDate':
        if (!value) return 'تاریخ رفت الزامی است';
        return '';
      case 'birthDate':
        if (!value) return 'تاریخ تولد الزامی است';
        return '';
      case 'gender':
        if (!value) return 'جنسیت الزامی است';
        return '';
      case 'guardianFirstName':
        if (value && value.length < 3) return 'نام سرپرست باید حداقل ۳ حرف باشد';
        return '';
      case 'guardianLastName':
        if (value && value.length < 3) return 'نام خانوادگی سرپرست باید حداقل ۳ حرف باشد';
        return '';
      case 'guardianMobile':
        if (value && !/^09\d{9}$/.test(value)) return 'شماره موبایل سرپرست باید با ۰۹ شروع شود و ۱۱ رقم باشد';
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

  const handleDateChange = (date: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, date) }));
  };

  const validateNationalCode = async (nationalCode: string) => {
    if (!/^\d{10}$/.test(nationalCode)) {
      setNationalCodeError('کد ملی باید دقیقاً ۱۰ رقم باشد');
      return false;
    }
    try {
      const response = await axiosInstance.get(`/passengers/check-national-code/${nationalCode}`);
      if (response.data.exists) {
        setNationalCodeError('این کد ملی قبلاً ثبت شده است');
        return false;
      }
      setNationalCodeError('');
      return true;
    } catch (err: any) {
      console.error('National code validation error:', err);
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
      gender: validateField('gender', formData.gender),
      guardianFirstName: validateField('guardianFirstName', formData.guardianFirstName),
      guardianLastName: validateField('guardianLastName', formData.guardianLastName),
      guardianMobile: validateField('guardianMobile', formData.guardianMobile),
      general: '',
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== '')) return;

    if (!(await validateNationalCode(formData.nationalCode))) return;

    setIsLoading(true); // استفاده از isLoading
    try {
      const response = await axiosInstance.post('/passengers', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        nationalCode: formData.nationalCode,
        phone: formData.mobile,
        travelDate: formData.departureDate,
        returnDate: formData.returnDate || null,
        birthDate: formData.birthDate,
        travelType: formData.travelType,
        leaderName: formData.guardianFirstName,
        leaderPhone: formData.guardianMobile,
        gender: formData.gender,
      });
      console.log('Passenger created:', response.data);
      setSuccess('مسافر با موفقیت ثبت شد!');
      setTimeout(() => navigate('/packs'), 2000); // ریدایرکت بعد از ۲ ثانیه
    } catch (err: any) {
      console.error('Submit error:', err);
      setErrors({
        ...errors,
        general: `خطا در ثبت: ${err.message === 'چنین آدرسی وجود ندارد' ? 'چنین آدرسی وجود ندارد' : err.response?.data?.message || err.message}`,
      });
    } finally {
      setIsLoading(false); // استفاده از isLoading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-purple-200 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all hover:scale-105 animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">ثبت مسافر وی آی پی</h2>
        {errors.general && <p className="text-red-500 mb-4 text-center">{errors.general}</p>}
        {nationalCodeError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-center animate-pulse">
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p>{nationalCodeError}</p>
          </div>
        )}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="firstName">نام</label>
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
            <label className="block text-gray-700 mb-2 text-right" htmlFor="lastName">نام خانوادگی</label>
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
            <label className="block text-gray-700 mb-2 text-right" htmlFor="nationalCode">کد ملی</label>
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
            <label className="block text-gray-700 mb-2 text-right" htmlFor="mobile">شماره موبایل</label>
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
            <label className="block text-gray-700 mb-2 text-right" htmlFor="departureDate">تاریخ رفت</label>
            <DateSelector
              onDateChange={(date) => handleDateChange(date, 'departureDate')}
              initialDate={formData.departureDate}
              dateType="departure"
            />
            {errors.departureDate && <p className="text-red-500 text-sm mt-1 text-right">{errors.departureDate}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="returnDate">تاریخ برگشت</label>
            <DateSelector
              onDateChange={(date) => handleDateChange(date, 'returnDate')}
              initialDate={formData.returnDate || '1404-04-01'}
              dateType="return"
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="birthDate">تاریخ تولد</label>
            <DateSelector
              onDateChange={(date) => handleDateChange(date, 'birthDate')}
              initialDate={formData.birthDate}
              dateType="birth"
            />
            {errors.birthDate && <p className="text-red-500 text-sm mt-1 text-right">{errors.birthDate}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="gender">جنسیت</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              required
            >
              <option value="">جنسیت را انتخاب کنید</option>
              <option value="مرد">مرد</option>
              <option value="زن">زن</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1 text-right">{errors.gender}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="guardianFirstName">نام سرپرست</label>
            <input
              type="text"
              id="guardianFirstName"
              name="guardianFirstName"
              value={formData.guardianFirstName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
            />
            {errors.guardianFirstName && <p className="text-red-500 text-sm mt-1 text-right">{errors.guardianFirstName}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 text-right" htmlFor="guardianMobile">موبایل سرپرست</label>
            <input
              type="text"
              id="guardianMobile"
              name="guardianMobile"
              value={formData.guardianMobile}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
            />
            {errors.guardianMobile && <p className="text-red-500 text-sm mt-1 text-right">{errors.guardianMobile}</p>}
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