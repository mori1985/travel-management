import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosConfig';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import moment from 'jalali-moment';

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
  status: string;
  passengers: Passenger[];
  busAssignment?: BusAssignment;
}

const BusAssignment = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [expandedPack, setExpandedPack] = useState<number | null>(null);
  const [formData, setFormData] = useState<{ [packId: number]: BusAssignment }>({});
  const [showReturnConfirm, setShowReturnConfirm] = useState<number | null>(null);
  const [showNextStageConfirm, setShowNextStageConfirm] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [packId: number]: { [key: string]: string } }>({});
  const [selectedType, setSelectedType] = useState<'normal' | 'vip' | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const companies = ['شرکت سیروسفر', 'شرکت همسفر', 'شرکت ایران‌پیما', 'شرکت رویال سفر'];

  const role = localStorage.getItem('role');
  useEffect(() => {
    if (role !== 'level2' && role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  const fetchPacks = async () => {
    try {
      //setLoading(true);
      const response = await axiosInstance.get('/bus-assignment/packs/bus-assignment');
      console.log('Fetched packs from /bus-assignment/packs/bus-assignment:', response.data);
      setPacks(response.data);
      const initialFormData: { [packId: number]: BusAssignment } = {};
      response.data.forEach((pack: Pack) => {
        if (pack.busAssignment) {
          initialFormData[pack.id] = { ...pack.busAssignment };
        }
      });
      setFormData(initialFormData);
      return response.data;
    } catch (err: any) {
      console.error('Error fetching packs:', err);
      alert('خطا در بارگذاری پک‌ها: ' + (err.message === 'چنین آدرسی وجود ندارد' ? 'چنین آدرسی وجود ندارد' : err.response?.data?.message || err.message || 'خطایی رخ داده است'));
      return null;
    } finally {
      //setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, [location.state]);

  const togglePack = (packId: number) => {
    setExpandedPack(expandedPack === packId ? null : packId);
  };

  const handleFormChange = (packId: number, field: keyof BusAssignment, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [packId]: {
        ...prev[packId] || { company: '', plate: '', driver: '', driverPhone: '' },
        [field]: value,
      },
    }));
    setErrors((prev) => ({
      ...prev,
      [packId]: {
        ...prev[packId],
        [field]: '',
      },
    }));
  };

  const handlePlateChange = (
    packId: number,
    part: 'first' | 'letter' | 'second',
    value: string
  ) => {
    const currentData = formData[packId] || {
      company: '',
      plate: '',
      driver: '',
      driverPhone: '',
    };
    const parts = currentData.plate ? currentData.plate.split('-') : ['', 'ع', ''];

    if (part === 'first') {
      parts[0] = value;
    } else if (part === 'letter') {
      parts[1] = value;
    } else if (part === 'second') {
      parts[2] = value;
    }

    const newLicensePlate = parts.filter(Boolean).join('-');
    handleFormChange(packId, 'plate', newLicensePlate);
  };

  const validateForm = (packId: number) => {
    const assignmentData = formData[packId];
    const newErrors: { [key: string]: string } = {};

    if (!assignmentData?.company) {
      newErrors.company = 'نام شرکت الزامی است';
    }

    const plateParts = assignmentData?.plate ? assignmentData.plate.split('-') : [];
    if (
      !plateParts[0] ||
      !/^\d{3}$/.test(plateParts[0]) ||
      !plateParts[1] ||
      plateParts[1] !== 'ع' ||
      !plateParts[2] ||
      !/^\d{2}$/.test(plateParts[2])
    ) {
      newErrors.plate = 'فرمت پلاک باید مثل ۱۲۳-ع-۴۵ باشد';
    }

    if (!assignmentData?.driver) {
      newErrors.driver = 'نام راننده الزامی است';
    }

    if (!assignmentData?.driverPhone || !/^09\d{9}$/.test(assignmentData.driverPhone)) {
      newErrors.driverPhone = 'فرمت شماره موبایل باید مثل 09123456789 باشد';
    }

    setErrors((prev) => ({
      ...prev,
      [packId]: newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  };

  const saveBusAssignment = async (packId: number) => {
    const assignmentData = formData[packId];
    try {
      console.log('Sending assignment data to /bus-assignment/:packId:', assignmentData);
      const response = await axiosInstance.post(`/packs/bus-assignment/${packId}`, {
        company: assignmentData.company,
        plate: assignmentData.plate,
        driver: assignmentData.driver,
        driverPhone: assignmentData.driverPhone,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Bus assignment saved response:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('Error saving bus assignment:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || err.message || 'خطا در ثبت اطلاعات اتوبوس');
    }
  };

  const handleSubmit = async (packId: number) => {
    const isValid = validateForm(packId);
    if (!isValid) {
      console.log('Form validation failed:', errors[packId]);
      return;
    }
    try {
      const response = await saveBusAssignment(packId);
      console.log('Saved bus assignment:', response);
      const updatedPacks = await fetchPacks();
      console.log('Updated packs after save:', updatedPacks);
      if (updatedPacks) {
        setShowNextStageConfirm(packId);
      } else {
        throw new Error('دریافت پک‌ها با مشکل مواجه شد');
      }
    } catch (err: any) {
      console.error('Error during submission:', err);
      alert('خطا در ثبت اطلاعات اتوبوس: ' + (err.message === 'چنین آدرسی وجود ندارد' ? 'چنین آدرسی وجود ندارد' : err.message || 'خطایی رخ داده است'));
    }
  };

  const handleNextStage = async (packId: number) => {
    try {
      const pack = packs.find((p) => p.id === packId);
      if (!pack) {
        throw new Error('پک یافت نشد');
      }

      const response = await axiosInstance.post(`/bus-assignment/${packId}/move-to-next-stage`, { status: 'confirmed' }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Moved to next stage response:', response.data);
      await fetchPacks();
      navigate('/final-confirmation', { state: { pack: response.data } });
    } catch (err: any) {
      console.error('Error moving to next stage:', err);
      alert('خطا در ارسال به مرحله بعدی: ' + (err.response?.data?.message || err.message || 'خطایی رخ داده است'));
    } finally {
      setShowNextStageConfirm(null);
    }
  };

  const handlePreviousStage = async (packId: number) => {
    try {
      const response = await axiosInstance.post(`/bus-assignment/${packId}/previous-stage`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Moved to previous stage:', response.data);
      await fetchPacks();
      setShowReturnConfirm(null);
      navigate('/packs');
    } catch (err: any) {
      console.error('Error moving to previous stage:', err);
      const errorMessage = err.response?.data?.message || err.message || 'خطایی رخ داده است';
      alert(`خطا در بازگشت به مرحله قبل: ${errorMessage}`);
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    const cleanDate = date.split('T')[0];
    console.log('Raw date in BusAssignment:', cleanDate);
    const formatted = moment(cleanDate, 'jYYYY-jMM-jDD').locale('fa').format('jD MMMM jYYYY');
    return formatted;
  };

  const isPackFull = (pack: Pack) => {
    return pack.passengers.length >= (pack.type === 'vip' ? 25 : 40);
  };

  const filteredPacks = selectedType ? packs.filter((pack) => pack.type === selectedType) : packs;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-purple-200 p-6">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">تخصیص اتوبوس</h1>
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => navigate('/packs')}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          بازگشت به صفحه پک‌های مسافرتی
        </button>
        <select
          value={selectedType || ''}
          onChange={(e) => setSelectedType(e.target.value as 'normal' | 'vip' | null)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-right"
        >
          <option value="">همه پک‌ها</option>
          <option value="normal">پک‌های عادی</option>
          <option value="vip">پک‌های VIP</option>
        </select>
      </div>
      {filteredPacks.length === 0 ? (
        <p className="text-center text-gray-600">هیچ پکی برای تخصیص موجود نیست</p>
      ) : (
        <div className="space-y-6">
          {filteredPacks.map((pack) => (
            <div key={pack.id} className="bg-white rounded-lg shadow-lg p-6">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => togglePack(pack.id)}
              >
                <h2 className={`text-2xl font-semibold ${isPackFull(pack) ? 'text-red-500 animate-pulse' : 'text-purple-600'}`}>
                  پک {pack.type === 'vip' ? 'VIP' : 'عادی'} - کد: {pack.id} - تاریخ: {formatDate(pack.travelDate)} - تعداد مسافران: {pack.passengers.length}/{pack.type === 'vip' ? 25 : 40}
                </h2>
                {expandedPack === pack.id ? (
                  <FaChevronUp className="text-purple-600" />
                ) : (
                  <FaChevronDown className="text-purple-600" />
                )}
              </div>
              {expandedPack === pack.id && (
                <div className="mt-4">
                  {pack.passengers.length === 0 ? (
                    <p className="text-center text-gray-600">هیچ مسافری در این پک ثبت نشده است</p>
                  ) : (
                    <>
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
                              <th className="p-3 border border-gray-300">تاریخ تولد</th>
                              <th className="p-3 border border-gray-300">نام سرپرست</th>
                              <th className="p-3 border border-gray-300">موبایل سرپرست</th>
                              <th className="p-3 border border-gray-300">جنسیت</th>
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

                      {pack.status === 'assigned' && (
                        <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-2xl border border-purple-200">
                          <h3 className="text-xl font-semibold text-purple-700 mb-4 text-center">فرم تخصیص اتوبوس</h3>
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-gray-700 mb-2 text-right">شرکت مسافربری</label>
                              <select
                                value={formData[pack.id]?.company || pack.busAssignment?.company || ''}
                                onChange={(e) => handleFormChange(pack.id, 'company', e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right bg-white"
                              >
                                <option value="">انتخاب شرکت</option>
                                {companies.map((company) => (
                                  <option key={company} value={company}>{company}</option>
                                ))}
                              </select>
                              {errors[pack.id]?.company && (
                                <p className="text-red-500 text-sm mt-1 text-right">{errors[pack.id].company}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-gray-700 mb-2 text-right">پلاک اتوبوس</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={formData[pack.id]?.plate?.split('-')[0] || pack.busAssignment?.plate?.split('-')[0] || ''}
                                  onChange={(e) => handlePlateChange(pack.id, 'first', e.target.value)}
                                  className="w-1/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right bg-white"
                                  placeholder="۱۲۳"
                                  maxLength={3}
                                  onInput={(e) => {
                                    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                  }}
                                />
                                <select
                                  value={formData[pack.id]?.plate?.split('-')[1] || pack.busAssignment?.plate?.split('-')[1] || 'ع'}
                                  onChange={(e) => handlePlateChange(pack.id, 'letter', e.target.value)}
                                  className="w-1/6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right bg-white"
                                >
                                  <option value="ع">ع</option>
                                </select>
                                <input
                                  type="text"
                                  value={formData[pack.id]?.plate?.split('-')[2] || pack.busAssignment?.plate?.split('-')[2] || ''}
                                  onChange={(e) => handlePlateChange(pack.id, 'second', e.target.value)}
                                  className="w-1/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right bg-white"
                                  placeholder="۴۵"
                                  maxLength={2}
                                  onInput={(e) => {
                                    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                  }}
                                />
                              </div>
                              {errors[pack.id]?.plate && (
                                <p className="text-red-500 text-sm mt-1 text-right">{errors[pack.id].plate}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-gray-700 mb-2 text-right">نام راننده</label>
                              <input
                                type="text"
                                value={formData[pack.id]?.driver || pack.busAssignment?.driver || ''}
                                onChange={(e) => handleFormChange(pack.id, 'driver', e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right bg-white"
                                placeholder="نام راننده"
                              />
                              {errors[pack.id]?.driver && (
                                <p className="text-red-500 text-sm mt-1 text-right">{errors[pack.id].driver}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-gray-700 mb-2 text-right">شماره موبایل راننده</label>
                              <input
                                type="text"
                                value={formData[pack.id]?.driverPhone || pack.busAssignment?.driverPhone || ''}
                                onChange={(e) => handleFormChange(pack.id, 'driverPhone', e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right bg-white"
                                placeholder="مثال: 09123456789"
                                maxLength={11}
                                onInput={(e) => {
                                  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                }}
                              />
                              {errors[pack.id]?.driverPhone && (
                                <p className="text-red-500 text-sm mt-1 text-right">{errors[pack.id].driverPhone}</p>
                              )}
                            </div>
                          </div>
                          <div className="mt-6 flex justify-end gap-4">
                            <button
                              onClick={() => setShowReturnConfirm(pack.id)}
                              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300 font-semibold"
                            >
                              برگشت به مرحله قبل
                            </button>
                            <button
                              onClick={() => handleSubmit(pack.id)}
                              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 font-semibold"
                            >
                              ارسال به مرحله بعدی
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
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
                onClick={() => handlePreviousStage(showReturnConfirm)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                بله
              </button>
              <button
                onClick={() => setShowReturnConfirm(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                خیر
              </button>
            </div>
          </div>
        </div>
      )}

      {showNextStageConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-center mb-4">آیا مطمئن هستید که می‌خواهید به مرحله بعدی بروید؟</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleNextStage(showNextStageConfirm)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                بله
              </button>
              <button
                onClick={() => setShowNextStageConfirm(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                خیر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusAssignment;