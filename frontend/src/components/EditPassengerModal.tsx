import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import DateSelector from './DateSelector';
import { Passenger } from './Packs';
import moment from 'jalali-moment';

interface EditPassengerModalProps {
  show: boolean;
  passenger: Passenger | undefined;
  packTravelDate: string;
  packId: number | undefined;
  onSave: (passenger: Passenger) => void;
  onCancel: () => void;
}

const EditPassengerModal: React.FC<EditPassengerModalProps> = ({ show, passenger, packTravelDate, packId, onSave, onCancel }) => {
  const [editedPassenger, setEditedPassenger] = useState<Passenger | undefined>(passenger);
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    firstName: '',
    lastName: '',
    nationalCode: '',
    phone: '',
    birthDate: '',
    returnDate: '',
    // leaderLastName: '', // اضافه کردن خطا برای نام خانوادگی سرپرست
    general: '',
  });
  const [nationalCodeError, setNationalCodeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialPassenger = passenger || {
      id: 0,
      firstName: '',
      lastName: '',
      nationalCode: '',
      phone: '',
      travelDate: packTravelDate,
      returnDate: '1404-04-01',
      birthDate: '1404-01-01',
      leaderName: '',
      leaderPhone: '',
      gender: '',
    };
    setEditedPassenger(initialPassenger);
    setErrors({ firstName: '', lastName: '', nationalCode: '', phone: '', birthDate: '', returnDate: '', leaderLastName: '', general: '' });
    setNationalCodeError('');
  }, [passenger, packTravelDate]);

  if (!show || !editedPassenger) return null;

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
      case 'phone':
        if (!/^09\d{9}$/.test(value)) return 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد (مثلاً 09123456789)';
        return '';
      case 'birthDate':
        if (!value) return 'تاریخ تولد الزامی است';
        return '';
      case 'returnDate':
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedPassenger((prev) => (prev ? { ...prev, [name]: value } : prev));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleDateChange = (date: string, field: string) => {
    setEditedPassenger((prev) => {
      if (prev && prev[field] !== date) {
        return { ...prev, [field]: date };
      }
      return prev;
    });
    setErrors((prev) => ({ ...prev, [field]: validateField(field, date) }));
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
      setNationalCodeError('خطا در بررسی کد ملی (endpoint ممکن است وجود نداشته باشد)');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      firstName: validateField('firstName', editedPassenger.firstName),
      lastName: validateField('lastName', editedPassenger.lastName),
      nationalCode: validateField('nationalCode', editedPassenger.nationalCode),
      phone: validateField('phone', editedPassenger.phone),
      birthDate: validateField('birthDate', editedPassenger.birthDate),
      returnDate: validateField('returnDate', editedPassenger.returnDate),
      leaderLastName: validateField('leaderLastName', editedPassenger.leaderLastName || ''),
      general: '',
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== '')) return;

    if (editedPassenger.id === 0) {
      if (!(await validateNationalCode(editedPassenger.nationalCode))) return;
    }

    setIsLoading(true);
    try {
      const passengerToSave = {
        ...editedPassenger,
        travelDate: packTravelDate,
        returnDate: editedPassenger.returnDate || undefined,
        birthDate: editedPassenger.birthDate,
        leaderName: editedPassenger.leaderName || undefined,
        leaderPhone: editedPassenger.leaderPhone || undefined,
      };
      onSave(passengerToSave);
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, general: `خطا در ثبت: ${err.response?.data?.message || err.message}` }));
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return 'انتخاب کنید';
    const cleanDate = date.split('T')[0]; // حذف T00:00:00.000Z
    const formatted = moment(cleanDate, 'jYYYY-jMM-jDD').locale('fa').format('jD MMMM jYYYY');
    return formatted;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 text-purple-600">ویرایش/افزودن مسافر</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">نام</label>
            <input
              type="text"
              name="firstName"
              value={editedPassenger.firstName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              required
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1 text-right">{errors.firstName}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">نام خانوادگی</label>
            <input
              type="text"
              name="lastName"
              value={editedPassenger.lastName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              required
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1 text-right">{errors.lastName}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">کد ملی</label>
            <input
              type="text"
              name="nationalCode"
              value={editedPassenger.nationalCode}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              required
            />
            {errors.nationalCode && <p className="text-red-500 text-sm mt-1 text-right">{errors.nationalCode}</p>}
            {nationalCodeError && <p className="text-red-500 text-sm mt-1 text-right">{nationalCodeError}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">شماره موبایل</label>
            <input
              type="text"
              name="phone"
              value={editedPassenger.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              required
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1 text-right">{errors.phone}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">تاریخ رفت</label>
            <input
              type="text"
              value={formatDate(packTravelDate)}
              className="w-full p-3 border rounded-lg bg-gray-100 text-right"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">تاریخ برگشت</label>
            <DateSelector
              onDateChange={(date) => handleDateChange(date, 'returnDate')}
              initialDate={editedPassenger.returnDate || '1404-04-01'}
              dateType="return"
            />
            {errors.returnDate && <p className="text-red-500 text-sm mt-1 text-right">{errors.returnDate}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">تاریخ تولد</label>
            <DateSelector
              onDateChange={(date) => handleDateChange(date, 'birthDate')}
              initialDate={editedPassenger.birthDate || '1404-01-01'}
              dateType="birth"
            />
            {errors.birthDate && <p className="text-red-500 text-sm mt-1 text-right">{errors.birthDate}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">نام و نام خانوادگی  سرپرست</label>
            <input
              type="text"
              name="leaderName"
              value={editedPassenger.leaderName || ''}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              placeholder="نام و نام خانوادگی سرپرست (اختیاری)"
            />
          </div>
         
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">موبایل سرپرست</label>
            <input
              type="text"
              name="leaderPhone"
              value={editedPassenger.leaderPhone || ''}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              placeholder="موبایل سرپرست (اختیاری)"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">جنسیت</label>
            <select
              name="gender"
              value={editedPassenger.gender}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
            >
              <option value="" disabled>جنسیت را انتخاب کنید</option>
              <option value="مذکر">مذکر</option>
              <option value="مونث">مونث</option>
              <option value="نامشخص">نامشخص</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : null}
              {isLoading ? 'در حال ثبت...' : 'ذخیره'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              لغو
            </button>
          </div>
          {errors.general && <p className="text-red-500 text-sm mt-2 text-center">{errors.general}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditPassengerModal;