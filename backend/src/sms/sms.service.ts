import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { SendSmsDto } from './send-sms.dto';

const request = require('request');

interface Recipient {
  phone: string;
  type: string; // passenger, driver, company, responsible
}

interface RequestResponse {
  body: string;
  statusCode: number;
  headers: any;
}

@Injectable()
export class SmsService {
  private readonly senderNumber: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GHASEDAK_API_KEY');
    console.log('GHASEDAK_API_KEY:', apiKey); // برای دیباگ
    if (!apiKey) {
      throw new Error('GHASEDAK_API_KEY is not defined in environment variables');
    }
    this.senderNumber = '30006703337085'; // شماره خط خدماتی معتبر (از پنل قاصدک بگیر)
  }

  // لیست شرکت‌ها و شماره‌ها
  private readonly companies: { name: string; phone: string }[] = [
    { name: 'ایران‌پیما', phone: '09120000001' },
    { name: 'هما', phone: '09120000002' },
  ];

  // لیست مسئولین
  private readonly responsiblePersons: { name: string; phone: string }[] = [
    { name: 'علی محمدی', phone: '09120961862' },
    { name: 'رضا احمدی', phone: '09391872895' },
    { name: 'حسن رضایی', phone: '09127654321' },
    { name: 'محمد حسینی', phone: '09121234567' },
    { name: 'سعید کریمی', phone: '09122345678' },
    { name: 'مهدی موسوی', phone: '09123467890' },
    { name: 'علی اکبری', phone: '09124567890' },
    { name: 'رضا جعفری', phone: '09125678901' },
    { name: 'حسین علوی', phone: '09126789012' },
    { name: 'امیر قاسمی', phone: '09127890123' },
  ];

  // جمع‌آوری دریافت‌کنندگان به‌صورت خودکار
  async getRecipients(
    packId: number,
    selectedCompanies: string[],
    selectedResponsibles: string[],
  ): Promise<Recipient[]> {
    const recipients: Recipient[] = [];

    // 1. نوع پک رو بگیریم تا تعداد مسافران رو مشخص کنیم
    const pack = await this.prisma.pack.findUnique({
      where: { id: packId },
      select: { type: true },
    });
    const isVip = pack?.type === 'vip';
    const passengerLimit = isVip ? 25 : 40; // VIP: 25 مسافر، عادی: 40 مسافر

    // 2. مسافران (به تعداد مشخص از دیتابیس)
    const passengers = await this.prisma.passenger.findMany({
      where: { packId },
      select: { phone: true },
      take: passengerLimit, // محدود کردن تعداد مسافران
    });
    passengers.forEach((passenger) => {
      if (passenger.phone) {
        recipients.push({ phone: passenger.phone, type: 'passenger' });
      }
    });

    // 3. راننده (از BusAssignment)
    const busAssignment = await this.prisma.busAssignment.findFirst({
      where: { packId },
      select: { driverPhone: true },
    });
    if (busAssignment?.driverPhone) {
      recipients.push({ phone: busAssignment.driverPhone, type: 'driver' });
    }

    // 4. شرکت (انتخاب خودکار شماره بر اساس نام شرکت انتخاب‌شده)
    const companies = this.companies.filter((company) =>
      selectedCompanies.includes(company.name),
    );
    companies.forEach((company) => {
      recipients.push({ phone: company.phone, type: 'company' });
    });

    // 5. مسئولین (انتخاب خودکار شماره بر اساس نام‌های انتخاب‌شده)
    const responsibles = this.responsiblePersons.filter((person) =>
      selectedResponsibles.includes(person.name),
    );
    responsibles.forEach((person) => {
      recipients.push({ phone: person.phone, type: 'responsible' });
    });

    return recipients;
  }

  // تولید متن پیش‌فرض پیامک
  async generateMessageText(packId: number): Promise<string> {
    const pack = await this.prisma.pack.findUnique({
      where: { id: packId },
      select: { travelDate: true, type: true },
    });
    const busAssignment = await this.prisma.busAssignment.findFirst({
      where: { packId },
      select: { plate: true },
    });
    const finalConfirmation = await this.prisma.finalConfirmation.findFirst({
      where: { packId },
      select: { company: true },
    });

    console.log('Raw travelDate from database:', pack?.travelDate);

    const travelDate = pack?.travelDate?.toISOString().split('T')[0] || 'نامشخص';
    console.log('Formatted travelDate:', travelDate);

    const plate = busAssignment?.plate || 'نامشخص';
    const company = finalConfirmation?.company || 'نامشخص';
    const travelType = pack?.type === 'vip' ? 'VIP' : 'عادی';

    const messageText = `مسافر گرامی سلام\nتاریخ سفر شما: ${travelDate}\nشماره پلاک اتوبوس: ${plate}\nشرکت مسافربری: ${company}\nنوع اتوبوس: ${travelType}\nلذا برای نهایی کردن سفر خود تا 24 ساعت آینده به پایانه مسافربری قزوین شرکت ${company} مراجعه نمایید.`;
    console.log('Final messageText:', messageText);

    return messageText;
  }

  // ارسال انبوه پیامک با API send/bulk
  private async sendBulkSms(
    packId: number,
    recipients: Recipient[],
    messageText: string,
    adminId: number,
  ): Promise<any> {
    const apiKey = this.configService.get<string>('GHASEDAK_API_KEY');
    const receptorList = recipients.map((r) => r.phone).join(','); // لیست شماره‌ها با کاما جدا شده

    const options = {
      method: 'POST',
      url: 'http://api.ghasedaksms.com/v2/sms/send/bulk',
      headers: { apikey: apiKey },
      form: {
        message: messageText,
        sender: this.senderNumber,
        receptor: receptorList,
      },
    };

    try {
      const { response, body } = await new Promise<{ response: any; body: string }>((resolve, reject) => {
        request(options, (error: any, response: any, body: string) => {
          if (error) {
            reject(error);
          } else {
            resolve({ response, body });
          }
        });
      });

      const parsedBody = JSON.parse(body);
      let status = 'failed';
      let errorMessage: string | null = null;

      if (parsedBody.result === 'success') {
        // پارس کردن messageids به آرایه‌ای از اعداد
        const messageIds = parsedBody.messageids.split(',').map((id: string) => parseInt(id.trim()));
        // چک کردن اینکه همه messageids بزرگ‌تر از 1000 باشن
        const allIdsValid = messageIds.every((id: number) => id > 1000);
        if (allIdsValid) {
          status = 'success';
        } else {
          errorMessage = `شناسه‌های پیامک نامعتبر: ${parsedBody.messageids}`;
        }
      } else {
        errorMessage = parsedBody.message || `خطا از قاصدک: کد ${parsedBody.messageids}`;
      }

      // ذخیره گزارش برای هر گیرنده
      const smsRecords = recipients.map((recipient) => ({
        packId,
        recipientPhone: recipient.phone,
        recipientType: recipient.type,
        text: messageText,
        sentAt: new Date(),
        status: status,
        error: status === 'failed' ? errorMessage : null,
        createdBy: adminId,
      }));

      await this.prisma.smsHistory.createMany({
        data: smsRecords,
      });

      if (status === 'failed') {
        throw new Error(errorMessage || 'خطا در ارسال پیامک انبوه');
      }

      return { recipients, status: 'success', response: parsedBody };
    } catch (error: any) {
      console.error('خطا در ارسال پیامک انبوه:', error.message);
      const smsRecords = recipients.map((recipient) => ({
        packId,
        recipientPhone: recipient.phone,
        recipientType: recipient.type,
        text: messageText,
        sentAt: new Date(),
        status: 'failed',
        error: error.message,
        createdBy: adminId,
      }));

      await this.prisma.smsHistory.createMany({
        data: smsRecords,
      });
      throw error;
    }
  }

  // ارسال پیامک انبوه
  async sendSms(
    packId: number,
    sendSmsDto: SendSmsDto,
    adminId: number,
  ): Promise<any> {
    const { selectedCompanies, selectedResponsibles, messageText } = sendSmsDto;

    // جمع‌آوری گیرندگان
    const recipients = await this.getRecipients(packId, selectedCompanies, selectedResponsibles);

    if (recipients.length === 0) {
      throw new HttpException('هیچ گیرنده‌ای برای ارسال پیامک پیدا نشد.', HttpStatus.BAD_REQUEST);
    }

    // ارسال انبوه پیامک
    const result = await this.sendBulkSms(packId, recipients, messageText, adminId);

    return {
      message: 'پیامک با موفقیت ارسال شد.',
      successCount: recipients.length,
      recipients,
    };
  }

  // گزارش تعداد پیامک‌های موفق
  async getSmsReport(
    packId: number,
  ): Promise<{ successCount: number; messages: { text: string; sentAt: string }[] }> {
    const messages = await this.prisma.smsHistory.findMany({
      where: {
        packId,
        status: 'success',
      },
      select: {
        text: true,
        sentAt: true,
      },
      orderBy: { sentAt: 'desc' },
      take: 1, // فقط اولین پیامک موفق رو می‌گیریم
    });

    const successCount = await this.prisma.smsHistory.count({
      where: {
        packId,
        status: 'success',
      },
    });

    const formattedMessages = messages.map((msg) => ({
      text: msg.text,
      sentAt: new Date(msg.sentAt).toLocaleString('fa-IR'),
    }));

    return { successCount, messages: formattedMessages };
  }

  // دریافت لیست شرکت‌ها و مسئولین برای انتخاب
  getCompaniesAndResponsibles(): {
    companies: string[];
    responsibles: string[];
  } {
    return {
      companies: this.companies.map((company) => company.name),
      responsibles: this.responsiblePersons.map((person) => person.name),
    };
  }
}