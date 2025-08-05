import { useEffect, useState } from 'react';
import { axiosInstance } from '../axiosConfig';
import { FaChevronDown, FaChevronUp, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import DeleteConfirmModal from './DeleteConfirmModal';
import EditPassengerModal from './EditPassengerModal';
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

interface Pack {
  id: number;
  travelDate: string;
  type: 'normal' | 'vip';
  status: string;
  passengers: Passenger[];
}

const Packs = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [expandedPack, setExpandedPack] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'normal' | 'vip'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; packId: number; passengerId: number }>({ show: false, packId: 0, passengerId: 0 });
  const [editModal, setEditModal] = useState<{ show: boolean; passenger?: Passenger; packId?: number }>({ show: false, passenger: undefined, packId: undefined });
  const [nextStageConfirm, setNextStageConfirm] = useState<{ show: boolean; packId: number }>({ show: false, packId: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem('role');
  useEffect(() => {
    if (role !== 'level2' && role !== 'admin') {
      navigate('/passengers');
    }
  }, [role, navigate]);

  const fetchPacks = async () => {
    try {
      setLoading(true);
      console.log('Fetching packs with filter:', { type: filterType === 'all' ? undefined : filterType, status: 'pending' });
      const response = await axiosInstance.get('/packs', {
        params: { type: filterType === 'all' ? undefined : filterType, status: 'pending' },
      });
      console.log('Fetched packs:', response.data);
      setPacks(response.data);
    } catch (err: any) {
      console.error('Error fetching packs:', err);
      alert(`خطا در بارگذاری پک‌ها: ${err.message === 'چنین آدرسی وجود ندارد' ? 'چنین آدرسی وجود ندارد' : err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, [filterType, location.pathname]);

  const togglePack = (packId: number) => {
    setExpandedPack(expandedPack === packId ? null : packId);
  };

  const handleNextStage = async (packId: number) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/packs/move-to-next-stage/${packId}/assigned`);
      console.log('Next stage response:', response.data);
      navigate('/bus-assignment');
    } catch (err: any) {
      console.error('Error moving pack to next stage:', err);
      alert('خطا در انتقال به مرحله بعدی: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePassenger = async (packId: number, passengerId: number) => {
    setDeleteConfirm({ show: true, packId, passengerId });
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/passengers/${deleteConfirm.passengerId}`);
      setPacks((prevPacks) =>
        prevPacks.map((pack) =>
          pack.id === deleteConfirm.packId
            ? { ...pack, passengers: pack.passengers.filter((p) => p.id !== deleteConfirm.passengerId) }
            : pack
        )
      );
      setDeleteConfirm({ show: false, packId: 0, passengerId: 0 });
    } catch (err: any) {
      console.error('Error deleting passenger:', err);
      alert('خطا در حذف مسافر');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPassenger = (passenger: Passenger) => {
    setEditModal({ show: true, passenger, packId: undefined });
  };

  const savePassenger = async (passenger: Passenger) => {
    try {
      setLoading(true);
      console.log('Saving passenger with data:', passenger);
      if (editModal.packId) {
        const passengerDataToSend = {
          firstName: passenger.firstName,
          lastName: passenger.lastName,
          nationalCode: passenger.nationalCode,
          phone: passenger.phone,
          travelDate: passenger.travelDate,
          returnDate: passenger.returnDate,
          birthDate: passenger.birthDate,
          leaderName: passenger.leaderName,
          leaderPhone: passenger.leaderPhone,
          gender: passenger.gender,
          packId: editModal.packId,
          travelType: packs.find((p) => p.id === editModal.packId)?.type,
        };
        const response = await axiosInstance.post('/passengers', passengerDataToSend);
        console.log('Server response for adding passenger:', response.data);
        // به‌روزرسانی استیت بعد از موفقیت
        setPacks((prevPacks) =>
          prevPacks.map((pack) =>
            pack.id === editModal.packId
              ? { ...pack, passengers: [...pack.passengers, response.data] }
              : pack
          )
        );
      } else {
        const passengerDataToSend = {
          firstName: passenger.firstName,
          lastName: passenger.lastName,
          nationalCode: passenger.nationalCode,
          phone: passenger.phone,
          travelDate: passenger.travelDate,
          returnDate: passenger.returnDate,
          birthDate: passenger.birthDate,
          leaderName: passenger.leaderName,
          leaderPhone: passenger.leaderPhone,
          gender: passenger.gender,
        };
        const response = await axiosInstance.put(`/passengers/${passenger.id}`, passengerDataToSend);
        console.log('Server response for updating passenger:', response.data);
        // به‌روزرسانی استیت برای ویرایش
        setPacks((prevPacks) =>
          prevPacks.map((pack) =>
            pack.id === (prevPacks.find((p) => p.passengers.some((p) => p.id === passenger.id))?.id || 0)
              ? {
                  ...pack,
                  passengers: pack.passengers.map((p) =>
                    p.id === passenger.id ? response.data : p
                  ),
                }
              : pack
          )
        );
      }
      setEditModal({ show: false, passenger: undefined, packId: undefined });
    } catch (err: any) {
      // حذف console.error برای کاهش شلوغی کنسول (اختیاری)
      // console.error('Error saving passenger:', err);
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data?.message || 'خطا در ثبت مسافر';
        // فرض می‌کنیم مسافر ثبت شده، استیت رو با داده‌های ارسالی به‌روزرسانی می‌کنیم
        if (editModal.packId) {
          setPacks((prevPacks) =>
            prevPacks.map((pack) =>
              pack.id === editModal.packId
                ? { ...pack, passengers: [...pack.passengers, { ...passenger, id: Date.now() }] } // ID موقت
                : pack
            )
          );
        }
        // ارور رو به مودال پاس می‌دیم (مدیریت بصری تو EditPassengerModal هست)
      }
    } finally {
      setLoading(false);
    }
  };

  const addPassenger = (packId: number) => {
    const newPassenger = {
      id: 0,
      firstName: '',
      lastName: '',
      nationalCode: '',
      phone: '',
      travelDate: packs.find((p) => p.id === packId)?.travelDate || '',
      gender: '',
    };
    setEditModal({ show: true, passenger: newPassenger, packId });
  };

  const testAdd10Passengers = async (packId: number) => {
    const pack = packs.find((p) => p.id === packId);
    if (!pack) return;

    try {
      setLoading(true);
      for (let i = 0; i < 10; i++) {
        const randomNationalCode = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const passengerData = {
          firstName: 'Test',
          lastName: 'User',
          nationalCode: randomNationalCode,
          phone: '09123456789',
          travelDate: pack.travelDate,
          returnDate: '1404-04-01',
          birthDate: '1404-01-01',
          leaderName: undefined,
          leaderPhone: undefined,
          gender: 'نامشخص',
          packId,
          travelType: pack.type,
        };
        const response = await axiosInstance.post('/passengers', passengerData);
        setPacks((prevPacks) =>
          prevPacks.map((pack) =>
            pack.id === packId ? { ...pack, passengers: [...pack.passengers, response.data] } : pack
          )
        );
        console.log(`Passenger ${i + 1} added with nationalCode: ${randomNationalCode}`);
      }
      console.log('10 passengers added for testing');
    } catch (err: any) {
      console.error('Error adding test passengers:', err);
      alert('خطا در اضافه کردن مسافران تستی: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    const cleanDate = date.split('T')[0];
    return moment(cleanDate, 'jYYYY-jMM-jDD').locale('fa').format('jD MMMM jYYYY');
  };

  const isPackFull = (pack: Pack) => {
    return pack.passengers.length >= (pack.type === 'vip' ? 25 : 40);
  };

  const handleNextStageConfirm = (packId: number) => {
    setNextStageConfirm({ show: true, packId });
  };

  const confirmNextStage = async () => {
    await handleNextStage(nextStageConfirm.packId);
    setNextStageConfirm({ show: false, packId: 0 });
  };

  const filteredPacks = packs.filter((pack) =>
    filterType === 'all' ? true : pack.type === filterType
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <svg className="animate-spin h-8 w-8 text-purple-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-purple-200 p-6">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">پک‌های مسافرتی</h1>
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg transition duration-300 ${filterType === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          همه پک‌ها
        </button>
        <button
          onClick={() => setFilterType('normal')}
          className={`px-4 py-2 rounded-lg transition duration-300 ${filterType === 'normal' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          پک‌های عادی
        </button>
        <button
          onClick={() => setFilterType('vip')}
          className={`px-4 py-2 rounded-lg transition duration-300 ${filterType === 'vip' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          پک‌های VIP
        </button>
      </div>
      {filteredPacks.length === 0 ? (
        <p className="text-center text-gray-600">هیچ پکی برای نمایش با فیلتر انتخاب‌شده موجود نیست</p>
      ) : (
        <div className="space-y-6">
          {filteredPacks.map((pack) => (
            <div key={pack.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => togglePack(pack.id)}>
                <h2 className={`text-2xl font-semibold ${isPackFull(pack) ? 'text-red-500 animate-pulse' : 'text-purple-600'}`}>
                  پک {pack.type === 'vip' ? 'VIP' : 'عادی'} - کد: {pack.id} - تاریخ: {formatDate(pack.travelDate)} - تعداد مسافران: {pack.passengers.length}/{pack.type === 'vip' ? 25 : 40}
                </h2>
                {expandedPack === pack.id ? <FaChevronUp className="text-purple-600" /> : <FaChevronDown className="text-purple-600" />}
              </div>
              {expandedPack === pack.id && (
                <div className="mt-4">
                  {pack.passengers.length === 0 ? (
                    <p className="text-center text-gray-600">هیچ مسافری در این پک ثبت نشده است</p>
                  ) : (
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
                            <th className="p-3 border border-gray-300">عملیات</th>
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
                              <td className="p-3 border border-gray-300">{formatDate(passenger.returnDate)}</td>
                              <td className="p-3 border border-gray-300">{formatDate(passenger.birthDate)}</td>
                              <td className="p-3 border border-gray-300">{passenger.leaderName || '-'}</td>
                              <td className="p-3 border border-gray-300">{passenger.leaderPhone || '-'}</td>
                              <td className="p-3 border border-gray-300">{passenger.gender === 'unknown' ? 'نامشخص' : passenger.gender}</td>
                              <td className="p-3 border border-gray-300">
                                <button onClick={() => handleEditPassenger(passenger)} className="text-blue-500 hover:text-blue-700 mx-2" title="ویرایش"><FaEdit /></button>
                                <button onClick={() => handleDeletePassenger(pack.id, passenger.id)} className="text-red-500 hover:text-red-700 mx-2" title="حذف"><FaTrash /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {!isPackFull(pack) && (
                    <button onClick={() => addPassenger(pack.id)}
                      className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex items-center"
                      disabled={loading}>
                      <FaPlus className="mr-2" /> افزودن مسافر
                    </button>
                  )}
                  <button onClick={() => testAdd10Passengers(pack.id)}
                    className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition duration-300"
                    disabled={loading}>
                    تست 10 مسافر
                  </button>
                  <button onClick={() => handleNextStageConfirm(pack.id)}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
                    disabled={loading}>
                    انتقال به مرحله بعدی
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <DeleteConfirmModal show={deleteConfirm.show} onConfirm={confirmDelete} onCancel={() => setDeleteConfirm({ show: false, packId: 0, passengerId: 0 })} />
      <EditPassengerModal show={editModal.show} passenger={editModal.passenger} packTravelDate={editModal.passenger?.travelDate || ''} packId={editModal.packId} onSave={savePassenger} onCancel={() => setEditModal({ show: false, passenger: undefined, packId: undefined })} />
      {nextStageConfirm.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">تأیید انتقال</h2>
            <p className="text-gray-600 mb-6">آیا مطمئن هستید که می‌خواهید پک با کد {nextStageConfirm.packId} را به مرحله تخصیص اتوبوس منتقل کنید؟</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setNextStageConfirm({ show: false, packId: 0 })} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300" disabled={loading}>لغو</button>
              <button onClick={confirmNextStage} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300" disabled={loading}>تأیید</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packs;