import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import moment from 'jalali-moment';

interface SmsMessage {
  id: number;
  recipientPhone: string;
  recipientType: string;
  text: string;
  sentAt: string;
  status: string;
}

interface SendSMSProps {
  packId: number;
  onClose: () => void;
  onSend: () => void;
}

const SendSMS = ({ packId, onClose, onSend }: SendSMSProps) => {
  const [messageText, setMessageText] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedResponsibles, setSelectedResponsibles] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [responsibles, setResponsibles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptionsAndMessage = async () => {
      try {
        const optionsResponse = await axios.get('/sms/options');
        setCompanies(optionsResponse.data.companies);
        setResponsibles(optionsResponse.data.responsibles);

        const messageResponse = await axios.get(`/sms/default-message/${packId}`);
        setMessageText(messageResponse.data.messageText);
      } catch (error: any) {
        console.error('خطا در بارگذاری اطلاعات:', error);
        setErrorMessage('خطا در بارگذاری اطلاعات: ' + (error.response?.data?.message || error.message));
      }
    };

    fetchOptionsAndMessage();
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
    setErrorMessage('ارسال پیامک به همه اشخاص فعلاً غیرفعال است. لطفاً از دکمه تست استفاده کنید.');
  };

  const handleTestSms = async () => {
    const testPhone = '09120961862'; // شماره خودت
    const testMessage = 'این یک پیامک تست از سامانه است. شماره شما: ' + testPhone;

    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await axios.post(`/sms/send/${packId}`, {
        selectedCompanies: [],
        selectedResponsibles: [],
        messageText: testMessage,
        testPhone: testPhone,
      });
      alert('پیامک تست با موفقیت ارسال شد');
    } catch (error: any) {
      console.error('خطا در ارسال پیامک تست:', error);
      setErrorMessage('خطا در ارسال پیامک تست: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-purple-700 mb-4 text-center">ارسال پیامک برای پک شماره {packId}</h1>

      {errorMessage && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-purple-600 mb-2">دریافت‌کنندگان</h2>

        <div className="mb-4">
          <h3 className="text-md font-medium text-purple-500 mb-2">مسافران و راننده</h3>
          <p className="text-gray-600">به‌صورت خودکار انتخاب شده‌اند (فعلاً غیرفعال).</p>
        </div>

        <div className="mb-4">
          <h3 className="text-md font-medium text-purple-500 mb-2">شرکت‌ها</h3>
          {companies.map((company) => (
            <label key={company} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedCompanies.includes(company)}
                onChange={() => handleCompanyChange(company)}
                className="mr-2"
                disabled
              />
              {company}
            </label>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="text-md font-medium text-purple-500 mb-2">مسئولین</h3>
          {responsibles.map((responsible) => (
            <label key={responsible} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedResponsibles.includes(responsible)}
                onChange={() => handleResponsibleChange(responsible)}
                className="mr-2"
                disabled
              />
              {responsible}
            </label>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="text-md font-medium text-purple-500 mb-2">متن پیامک</h3>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full p-2 border rounded"
            rows={5}
            disabled
          />
          <p className="text-gray-600 mt-2">در حالت تست، یک پیام پیش‌فرض ارسال می‌شود.</p>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleTestSms}
            disabled={loading}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 transition duration-300"
          >
            {loading ? 'در حال ارسال...' : 'تست پیامک'}
          </button>
          <button
            onClick={handleSendSms}
            disabled={true}
            className="bg-green-600 text-white px-4 py-2 rounded-lg opacity-50 cursor-not-allowed"
          >
            ارسال (غیرفعال)
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendSMS;