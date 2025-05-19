import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
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
  companyName: string;
  licensePlate: string;
  driverName: string;
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
      const response = await axios.get('/packs/bus-assignment');
      setPacks(response.data);
      const newFormData = response.data.reduce((acc: { [packId: number]: BusAssignment }, pack: Pack) => {
        acc[pack.id] = {
          companyName: '',
          licensePlate: '',
          driverName: '',
          driverPhone: '',
        };
        return acc;
      }, {});
      setFormData(newFormData);
    } catch (err: any) {
      console.error('Error fetching packs:', err);
    }
  };

  useEffect(() => {
    fetchPacks();
    const initialPack = location.state?.pack;
    if (initialPack) {
      setPacks((prevPacks) => {
        if (prevPacks.some((p) => p.id === initialPack.id)) {
          return prevPacks;
        }
        return [...prevPacks, initialPack];
      });
      setFormData((prev) => ({
        ...prev,
        [initialPack.id]: {
          companyName: '',
          licensePlate: '',
          driverName: '',
          driverPhone: '',
        },
      }));
    }
  }, [location.state]);

  const togglePack = (packId: number) => {
    setExpandedPack(expandedPack === packId ? null : packId);
  };

  const handleFormChange = (packId: number, field: keyof BusAssignment, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [packId]: {
        ...prev[packId]!,
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
      companyName: '',
      licensePlate: '',
      driverName: '',
      driverPhone: '',
    };
    const parts = currentData.licensePlate ? currentData.licensePlate.split('-') : ['', 'ع', ''];

    if (part === 'first') {
      parts[0] = value;
    } else if (part === 'letter') {
      parts[1] = value;
    } else if (part === 'second') {
      parts[2] = value;
    }

    const newLicensePlate = parts.filter(Boolean).join('-');
    handleFormChange(packId, 'licensePlate', newLicensePlate);
  };

  const validateForm = (packId: number) => {
    const assignmentData = formData[packId];
    const newErrors: { [key: string]: string } = {};

    if (!assignmentData?.companyName) {
      newErrors.companyName = 'نام شرکت الزامی است';
    }

    const plateParts = assignmentData?.licensePlate ? assignmentData.licensePlate.split('-') : [];
    if (
      !plateParts[0] ||
      !/^\d{3}$/.test(plateParts[0]) ||
      !plateParts[1] ||
      plateParts[1] !== 'ع' ||
      !plateParts[2] ||
      !/^\d{2}$/.test(plateParts[2])
    ) {
      newErrors.licensePlate = 'فرمت پلاک باید مثل ۱۲۳-ع-۴۵ باشد';
    }

    if (!assignmentData?.driverName) {
      newErrors.driverName = 'نام راننده الزامی است';
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

  const handleSubmit = async (packId: number) => {
    const isValid = validateForm(packId);
    if (!isValid) {
      return;
    }
    setShowNextStageConfirm(packId);
  };

  const confirmNextStage = async (packId: number) => {
    try {
      const assignmentData = formData[packId];
      const pack = packs.find((p) => p.id === packId);
      if (!pack) {
        throw new Error('پک یافت نشد');
      }

      const response = await axios.post(`/bus-assignment/${packId}`, {
        company: assignmentData.companyName,
        plate: assignmentData.licensePlate,
        driver: assignmentData.driverName,
        driverPhone: assignmentData.driverPhone,
      });
      console.log('Bus assignment response:', response.data);

      await fetchPacks();
      navigate('/final-confirmation', { state: { pack: { ...pack, busAssignment: assignmentData } } });
    } catch (err: any) {
      console.error('Error saving bus assignment:', err);
      alert('خطا در ارسال به مرحله بعدی: ' + (err.response?.data?.message || err.message));
    } finally {
      setShowNextStageConfirm(null);
    }
  };

  const handlePreviousStage = async (packId: number) => {
    try {
      const response = await axios.post(`/packs/next-stage/${packId}`, { status: 'pending' });
      console.log('Previous stage response:', response.data);
      await fetchPacks();
      setShowReturnConfirm(null);
      navigate('/packs');
    } catch (err: any) {
      console.error('Error moving pack to previous stage:', err);
      alert('خطا در بازگشت به مرحله قبل: ' + (err.response?.data?.message || err.message));
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    const cleanDate = date.split('T')[0];
    return moment(cleanDate, 'YYYY-MM-DD').locale('fa').format('jD MMMM jYYYY');
  };

  const isPackFull = (pack: Pack) => {
    return pack.passengers.length >= (pack.type === 'vip' ? 25 : 40);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-purple-200 p-6">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">تخصیص اتوبوس</h1>
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => navigate('/packs')}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-300"
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
      {packs.length === 0 ? (
        <p className="text-center text-gray-600">هیچ پکی برای تخصیص موجود نیست</p>
      ) : (
        <div className="space-y-6">
          {packs.map((pack) => (
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

                      {pack.busAssignment && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold text-purple-600 mb-2">اطلاعات اتوبوس</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-right">
                              <thead>
                                <tr className="bg-purple-600 text-white">
                                  <th className="p-3 border border-gray-300">شرکت</th>
                                  <th className="p-3 border border-gray-300">پلاک</th>
                                  <th className="p-3 border border-gray-300">راننده</th>
                                  <th className="p-3 border border-gray-300">موبایل راننده</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="bg-yellow-100">
                                  <td className="p-3 border border-gray-300">{pack.busAssignment.companyName}</td>
                                  <td className="p-3 border border-gray-300">{pack.busAssignment.licensePlate}</td>
                                  <td className="p-3 border border-gray-300">{pack.busAssignment.driverName}</td>
                                  <td className="p-3 border border-gray-300">{pack.busAssignment.driverPhone}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {pack.busAssignment && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold text-purple-600 mb-2">اطلاعات تأیید</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-right">
                              <thead>
                                <tr className="bg-purple-600 text-white">
                                  <th className="p-3 border border-gray-300">نام دستگاه</th>
                                  <th className="p-3 border border-gray-300">نام و نام خانوادگی مسئول</th>
                                  <th className="p-3 border border-gray-300">محل امضا</th>
                                  <th className="p-3 border border-gray-300">توضیحات</th>
                                </tr>
                              </thead>
                              <tbody>
                                {[...Array(4)].map((_, index) => (
                                  <tr key={index} className="hover:bg-gray-100">
                                    <td className="p-3 border border-gray-300">-</td>
                                    <td className="p-3 border border-gray-300">-</td>
                                    <td className="p-3 border border-gray-300">-</td>
                                    <td className="p-3 border border-gray-300">-</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {!pack.busAssignment && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-2xl border border-purple-200">
                      <h3 className="text-xl font-semibold text-purple-700 mb-4 text-center">فرم تخصیص اتوبوس</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 mb-2 text-right">شرکت مسافربری</label>
                          <select
                            value={formData[pack.id]?.companyName || ''}
                            onChange={(e) => handleFormChange(pack.id, 'companyName', e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right bg-white"
                          >
                            <option value="">انتخاب شرکت</option>
                            {companies.map((company) => (
                              <option key={company} value={company}>{company}</option>
                            ))}
                          </select>
                          {errors[pack.id]?.companyName && (
                            <p className="text-red-500 text-sm mt-1 text-right">{errors[pack.id].companyName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2 text-right">پلاک اتوبوس</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={formData[pack.id]?.licensePlate?.split('-')[0] || ''}
                              onChange={(e) => handlePlateChange(pack.id, 'first', e.target.value)}
                              className="w-1/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right bg-white"
                              placeholder="۱۲۳"
                              maxLength={3}
                              onInput={(e) => {
                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                              }}
                            />
                            <select
                              value={formData[pack.id]?.licensePlate?.split('-')[1] || 'ع'}
                              onChange={(e) => handlePlateChange(pack.id, 'letter', e.target.value)}
                              className="w-1/6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right bg-white"
                            >
                              <option value="ع">ع</option>
                            </select>
                            <input
                              type="text"
                              value={formData[pack.id]?.licensePlate?.split('-')[2] || ''}
                              onChange={(e) => handlePlateChange(pack.id, 'second', e.target.value)}
                              className="w-1/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right bg-white"
                              placeholder="۴۵"
                              maxLength={2}
                              onInput={(e) => {
                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                              }}
                            />
                          </div>
                          {errors[pack.id]?.licensePlate && (
                            <p className="text-red-500 text-sm mt-1 text-right">{errors[pack.id].licensePlate}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2 text-right">نام راننده</label>
                          <input
                            type="text"
                            value={formData[pack.id]?.driverName || ''}
                            onChange={(e) => handleFormChange(pack.id, 'driverName', e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right bg-white"
                            placeholder="نام راننده"
                          />
                          {errors[pack.id]?.driverName && (
                            <p className="text-red-500 text-sm mt-1 text-right">{errors[pack.id].driverName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2 text-right">شماره موبایل راننده</label>
                          <input
                            type="text"
                            value={formData[pack.id]?.driverPhone || ''}
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
                onClick={() => confirmNextStage(showNextStageConfirm)}
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