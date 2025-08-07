import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosConfig';

interface SmsMessage {
  text: string;
  sentAt: string;
}

interface SendSMSProps {
  packId: number;
  onClose: () => void;
  onSend: () => Promise<void>; // تغییر به Promise<void>
}

const SendSMS = ({ packId, onClose, onSend }: SendSMSProps) => {
  const [messageText, setMessageText] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedResponsibles, setSelectedResponsibles] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [responsibles, setResponsibles] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState<number>(0);
  const [messages, setMessages] = useState<SmsMessage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptionsAndMessageAndReport = async () => {
      try {
        setLoading(true);
        const optionsResponse = await axiosInstance.get('/sms/options');
        setCompanies(optionsResponse.data.companies);
        setResponsibles(optionsResponse.data.responsibles);

        const messageResponse = await axiosInstance.get(`/sms/default-message/${packId}`);
        setMessageText(messageResponse.data.messageText);

        const reportResponse = await axiosInstance.get(`/sms/report/${packId}`);
        setSuccessCount(reportResponse.data.successCount);
        setMessages(reportResponse.data.messages);
      } catch (error: any) {
        console.error('خطا در بارگذاری اطلاعات:', error);
        setErrorMessage('خطا در بارگذاری اطلاعات: ' + (error.message === 'چنین آدرسی وجود ندارد' ? 'چنین آدرسی وجود ندارد' : error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchOptionsAndMessageAndReport();
  }, [packId]);

  const handleCompanyChange = (company: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(company)
        ? prev.filter((c) => c !== company)
        : [...prev, company]
    );
  };

  const handleResponsibleChange = (responsible: string) => {
    setSelectedResponsibles((prev) =>
      prev.includes(responsible)
        ? prev.filter((r) => r !== responsible)
        : [...prev, responsible]
    );
  };

  const handleSendSms = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await axiosInstance.post(`/sms/send/${packId}`, {
        selectedCompanies,
        selectedResponsibles,
        messageText,
      });
      alert('پیامک با موفقیت ارسال شد');
      await onSend(); // استفاده از await برای Promise
    } catch (error: any) {
      console.error('خطا در ارسال پیامک:', error);
      setErrorMessage('خطا در ارسال پیامک: ' + (error.message === 'چنین آدرسی وجود ندارد' ? 'چنین آدرسی وجود ندارد' : error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToReport = () => {
    navigate('/sms-report');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-purple-700 mb-4 text-center">ارسال پیامک برای پک شماره {packId}</h1>
      {successCount > 0 && (
        <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg relative mb-4">
          <div className="p-2 bg-red-100 text-red-700 rounded text-center">به این پک قبلاً پیامک ارسال شده است، تعداد پیامک‌های موفق: {successCount}</div>
          <div className="mt-2">
            <h3 className="text-md font-medium text-purple-500 mb-2">گزارش پیامک‌های ارسالی</h3>
            <div className="border-t pt-2">
              <div className="mb-2 p-2 bg-gray-100 rounded">
                <p className="text-sm text-gray-700">متن پیام: {messages[0].text}</p>
                <p className="text-sm text-gray-500">آخرین تاریخ ارسال: {messages[0].sentAt}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleNavigateToReport}
            className="absolute bottom-2 left-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out flex items-center gap-2"
            disabled={loading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 014-4h2m-2 0h2a4 4 0 014 4v2m-6-6V9a4 4 0 00-8 0v2m12 6v2a2 2 0 01-2 2H9a2 2 0 01-2-2v-2" />
            </svg>
            گزارش ریز پیامک‌ها
          </button>
        </div>
      )}
      {errorMessage && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{errorMessage}</div>}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-purple-600 mb-2">دریافت‌کنندگان</h2>
        <div className="mb-4"><h3 className="text-md font-medium text-purple-500 mb-2">مسافران و راننده</h3><p className="text-gray-600">به‌صورت خودکار انتخاب شده‌اند.</p></div>
        <div className="mb-4"><h3 className="text-md font-medium text-purple-500 mb-2">شرکت‌ها</h3>{companies.map((company) => (<label key={company} className="flex items-center mb-2"><input type="checkbox" checked={selectedCompanies.includes(company)} onChange={() => handleCompanyChange(company)} className="mr-2" disabled={loading} />{company}</label>))}</div>
        <div className="mb-4"><h3 className="text-md font-medium text-purple-500 mb-2">مسئولین (حداکثر ۱۰ نفر)</h3>{responsibles.map((responsible) => (<label key={responsible} className="flex items-center mb-2"><input type="checkbox" checked={selectedResponsibles.includes(responsible)} onChange={() => handleResponsibleChange(responsible)} className="mr-2" disabled={selectedResponsibles.length >= 10 && !selectedResponsibles.includes(responsible) || loading} />{responsible}</label>))}</div>
        <div className="mb-4"><h3 className="text-md font-medium text-purple-500 mb-2">متن پیامک</h3><textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} className="w-full p-2 border rounded" rows={5} disabled={loading} /></div>
        {successCount === 0 && <div className="mb-4"><h3 className="text-md font-medium text-purple-500 mb-2">گزارش پیامک‌های ارسالی</h3><p className="text-gray-600">هنوز پیامک موفقی برای این پک ارسال نشده است.</p></div>}
        <div className="flex justify-between gap-4"><div className="flex gap-4"><button onClick={handleSendSms} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition duration-300">{loading ? 'در حال ارسال...' : 'ارسال'}</button><button onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300" disabled={loading}>بستن</button></div></div>
      </div>
    </div>
  );
};

export default SendSMS;