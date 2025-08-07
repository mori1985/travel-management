import { useState, useEffect } from 'react';
import { axiosInstance } from '../axiosConfig';
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

// رفع ارورهای index signature
interface PassengerWithIndex extends Omit<Passenger, 'id'> {
  id: number;
  [key: string]: string | number | undefined;
}

const EditPassengerModal: React.FC<EditPassengerModalProps> = ({ show, passenger, packTravelDate, packId, onSave, onCancel }) => {
  const [editedPassenger, setEditedPassenger] = useState<PassengerWithIndex | undefined>(undefined);
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    firstName: '', lastName: '', nationalCode: '', phone: '', birthDate: '', returnDate: '', general: '',
  });
  const [nationalCodeError, setNationalCodeError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialPassenger: PassengerWithIndex = passenger
      ? { ...passenger }
      : {
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
    setErrors({ firstName: '', lastName: '', nationalCode: '', phone: '', birthDate: '', returnDate: '', general: '' });
    setNationalCodeError('');
  }, [passenger, packTravelDate]);

  if (!show || !editedPassenger) return null;

  const validateField = (name: string, value: string | undefined): string => {
    if (value === undefined) return 'مقدار خالی است';
    switch (name) {
      case 'firstName': return value.length < 3 ? 'نام باید حداقل ۳ حرف باشد' : '';
      case 'lastName': return value.length < 3 ? 'نام خانوادگی باید حداقل ۳ حرف باشد' : '';
      case 'nationalCode': return !/^\d{10}$/.test(value) ? 'کد ملی باید دقیقاً ۱۰ رقم باشد' : '';
      case 'phone': return !/^09\d{9}$/.test(value) ? 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد' : '';
      case 'birthDate': return !value ? 'تاریخ تولد الزامی است' : '';
      case 'returnDate': return '';
      default: return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedPassenger((prev) => (prev ? { ...prev, [name]: value } : prev));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleDateChange = (date: string, field: string) => {
    setEditedPassenger((prev) => (prev && prev[field] !== date ? { ...prev, [field]: date } : prev));
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
      setNationalCodeError('خطا در بررسی کد ملی');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      firstName: validateField('firstName', editedPassenger.firstName as string),
      lastName: validateField('lastName', editedPassenger.lastName as string),
      nationalCode: validateField('nationalCode', editedPassenger.nationalCode as string),
      phone: validateField('phone', editedPassenger.phone as string),
      birthDate: validateField('birthDate', editedPassenger.birthDate as string),
      returnDate: validateField('returnDate', editedPassenger.returnDate as string),
      general: '',
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== '')) return;

    if (editedPassenger.id === 0) {
      if (!(await validateNationalCode(editedPassenger.nationalCode as string))) return;
    }

    setLoading(true);
    try {
      const passengerToSave = {
        ...editedPassenger,
        travelDate: packTravelDate,
        returnDate: editedPassenger.returnDate || undefined,
        birthDate: editedPassenger.birthDate,
        leaderName: editedPassenger.leaderName || undefined,
        leaderPhone: editedPassenger.leaderPhone || undefined,
      };
      let response;
      if (editedPassenger.id === 0 && packId) {
        response = await axiosInstance.post('/passengers', { ...passengerToSave, packId });
      } else {
        response = await axiosInstance.put(`/passengers/${editedPassenger.id}`, passengerToSave);
      }
      setSuccess('مسافر با موفقیت ثبت شد!');
      onSave(response.data);
      setTimeout(() => {
        onCancel();
        setSuccess('');
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'خطا در ثبت مسافر';
      if (errorMessage.includes('قبلاً ثبت شده است') || errorMessage.includes('Internal Server Error')) {
        setNationalCodeError(errorMessage);
      } else {
        setErrors((prev) => ({
          ...prev,
          general: errorMessage,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return 'انتخاب کنید';
    const cleanDate = date.split('T')[0];
    return moment(cleanDate, 'jYYYY-jMM-jDD').locale('fa').format('jD MMMM jYYYY');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 text-purple-600">ویرایش/افزودن مسافر</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">نام</label>
            <input type="text" name="firstName" value={editedPassenger.firstName} onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              required disabled={loading} />
            {errors.firstName && <p className="text-red-500 text-sm mt-1 text-right">{errors.firstName}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">نام خانوادگی</label>
            <input type="text" name="lastName" value={editedPassenger.lastName} onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              required disabled={loading} />
            {errors.lastName && <p className="text-red-500 text-sm mt-1 text-right">{errors.lastName}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">کد ملی</label>
            <input type="text" name="nationalCode" value={editedPassenger.nationalCode} onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              required disabled={loading} />
            {errors.nationalCode && <p className="text-red-500 text-sm mt-1 text-right">{errors.nationalCode}</p>}
            {nationalCodeError && <p className="text-red-500 text-sm mt-1 text-right">{nationalCodeError}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">شماره موبایل</label>
            <input type="text" name="phone" value={editedPassenger.phone} onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              required disabled={loading} />
            {errors.phone && <p className="text-red-500 text-sm mt-1 text-right">{errors.phone}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">تاریخ رفت</label>
            <input type="text" value={formatDate(packTravelDate)}
              className="w-full p-3 border rounded-lg bg-gray-100 text-right" disabled />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">تاریخ برگشت</label>
            <DateSelector onDateChange={(date) => handleDateChange(date, 'returnDate')}
              initialDate={editedPassenger.returnDate || '1404-04-01'} dateType="return" disabled={loading} />
            {errors.returnDate && <p className="text-red-500 text-sm mt-1 text-right">{errors.returnDate}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">تاریخ تولد</label>
            <DateSelector onDateChange={(date) => handleDateChange(date, 'birthDate')}
              initialDate={editedPassenger.birthDate || '1404-01-01'} dateType="birth" disabled={loading} />
            {errors.birthDate && <p className="text-red-500 text-sm mt-1 text-right">{errors.birthDate}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">نام و نام خانوادگی سرپرست</label>
            <input type="text" name="leaderName" value={editedPassenger.leaderName || ''} onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              placeholder="نام و نام خانوادگی سرپرست (اختیاری)" disabled={loading} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">موبایل سرپرست</label>
            <input type="text" name="leaderPhone" value={editedPassenger.leaderPhone || ''} onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              placeholder="موبایل سرپرست (اختیاری)" disabled={loading} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-right">جنسیت</label>
            <select name="gender" value={editedPassenger.gender} onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              disabled={loading}>
              <option value="" disabled>جنسیت را انتخاب کنید</option>
              <option value="مرد">مرد</option>
              <option value="زن">زن</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
              disabled={loading}>
              {loading ? <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg> : null}
              {loading ? 'در حال ثبت...' : 'ذخیره'}
            </button>
            <button type="button" onClick={onCancel}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              disabled={loading}>لغو</button>
          </div>
          {errors.general && <p className="text-red-500 text-sm mt-2 text-center">{errors.general}</p>}
          {success && <p className="text-green-500 text-sm mt-2 text-center">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditPassengerModal;