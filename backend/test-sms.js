var request = require("request");

// تابع اعتبارسنجی پارامترها
function validateParams(options) {
  const { form } = options;
  if (!form.message || form.message.trim() === '') {
    throw new Error('متن پیام (message) نمی‌تونه خالی باشه');
  }
  if (!form.sender || !/^\d+$/.test(form.sender)) {
    throw new Error('شماره فرستنده (sender) باید یه شماره معتبر باشه');
  }
  if (!form.receptor || !/^09\d{9}$/.test(form.receptor)) {
    throw new Error('شماره گیرنده (receptor) باید یه شماره موبایل معتبر باشه (مثل 09123456789)');
  }
  if (!options.headers.apikey || options.headers.apikey.trim() === '') {
    throw new Error('API Key نمی‌تونه خالی باشه');
  }
}

// پارامترهای درخواست
var options = {
  method: 'POST',
  url: 'http://api.ghasedaksms.com/v2/sms/send/simple',
  headers: { apikey: 'L+nQ98qU4eA+SX1xgUHrPJAeqOlsr4vrzVq0nJKoMzU' },
  form: {
    message: 'test',
    sender: '30006703337085', // شماره خط خدماتی جدید (از پنل بگیر)
    receptor: '09120961862', // شماره گیرنده
  }
};

try {
  // اعتبارسنجی پارامترها قبل از ارسال
  validateParams(options);

  // لاگ کردن درخواست قبل از ارسال
  console.log('درخواست ارسالی به قاصدک:');
  console.log('URL:', options.url);
  console.log('هدرها:', JSON.stringify(options.headers, null, 2));
  console.log('بدنه:', JSON.stringify(options.form, null, 2));

  // ارسال درخواست
  request(options, function (error, response, body) {
    if (error) {
      console.error('خطا در ارسال درخواست به قاصدک:', error.message);
      console.error('جزئیات خطا:', error.stack);
      return;
    }

    // لاگ کردن وضعیت پاسخ
    console.log('وضعیت پاسخ HTTP:', response.statusCode);
    console.log('هدرهای پاسخ:', JSON.stringify(response.headers, null, 2));

    // لاگ کردن بدنه پاسخ
    console.log('بدنه پاسخ از قاصدک:', body);

    try {
      // تلاش برای پارس کردن بدنه پاسخ
      const result = JSON.parse(body);
      if (result.result === 'success') {
        console.log('پیامک با موفقیت ارسال شد! ID پیام:', result.messageids);
      } else {
        console.error('خطا از قاصدک:', result.message || 'خطای ناشناخته');
        console.error('کد خطا:', result.messageids || 'نامشخص');
        // توضیح خطا بر اساس مستندات
        switch (result.messageids) {
          case 2:
            console.error('توضیح خطا: آرایه‌ها خالی می‌باشد. یکی از پارامترهای message، sender یا receptor خالی یا نامعتبر است.');
            break;
          case 7:
            console.error('توضیح خطا: امکان دسترسی به خط مورد نظر وجود ندارد. شماره فرستنده (sender) تو پنل قاصدک تعریف نشده.');
            break;
          case 8:
            console.error('توضیح خطا: شماره گیرنده نامعتبر است.');
            break;
          case 9:
            console.error('توضیح خطا: حساب اعتبار ریالی مورد نیاز رو نداره. لطفاً حساب رو شارژ کن.');
            break;
          default:
            console.error('توضیح خطا: خطای ناشناخته. با پشتیبانی قاصدک تماس بگیر.');
        }
      }
    } catch (parseError) {
      console.error('خطا در پارس کردن پاسخ قاصدک:', parseError.message);
      console.error('بدنه خام پاسخ:', body);
    }
  });
} catch (validationError) {
  console.error('خطا در اعتبارسنجی پارامترها:', validationError.message);
}