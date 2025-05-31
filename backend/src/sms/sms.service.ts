import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { SendSmsDto } from './send-sms.dto';

const request = require('request');

interface Recipient {
  phone: string;
  type: string; // passenger, driver, company, responsible, test
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

  // لیست فرضی شرکت‌ها و شماره‌ها (بعداً با لیست واقعی جایگزین می‌شه)
  private readonly companies: { name: string; phone: string }[] = [
    { name: 'ایران‌پیما', phone: '09120000001' },
    { name: 'هما', phone: '09120000002' },
  ];

  // لیست فرضی مسئولین (بعداً با لیست واقعی جایگزین می‌شه)
  private readonly responsiblePersons: { name: string; phone: string }[] = [
    { name: 'علی محمدی', phone: '09123456789' },
    { name: 'رضا احمدی', phone: '09129876543' },
  ];

  // جمع‌آوری دریافت‌کنندگان (فعلاً غیرفعال تا تست تکمیل بشه)
  async getRecipients(
    packId: number,
    selectedCompanies: string[],
    selectedResponsibles: string[],
  ): Promise<Recipient[]> {
    const recipients: Recipient[] = [];

    // 1. مسافران (از جدول Passenger)
    const passengers = await this.prisma.passenger.findMany({
      where: { packId },
      select: { phone: true },
    });
    passengers.forEach((passenger) => {
      if (passenger.phone) {
        recipients.push({ phone: passenger.phone, type: 'passenger' });
      }
    });

    // 2. راننده (از BusAssignment)
    const busAssignment = await this.prisma.busAssignment.findFirst({
      where: { packId },
      select: { driverPhone: true },
    });
    if (busAssignment?.driverPhone) {
      recipients.push({ phone: busAssignment.driverPhone, type: 'driver' });
    }

    // 3. شرکت‌ها (انتخاب‌شده توسط ادمین)
    const companies = this.companies.filter((company) =>
      selectedCompanies.includes(company.name),
    );
    companies.forEach((company) => {
      recipients.push({ phone: company.phone, type: 'company' });
    });

    // 4. مسئولین (انتخاب‌شده توسط ادمین)
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

    const travelDate = pack?.travelDate
      ? new Date(pack.travelDate).toLocaleDateString('fa-IR')
      : 'نامشخص';
    const plate = busAssignment?.plate || 'نامشخص';
    const company = finalConfirmation?.company || 'نامشخص';
    const travelType = pack?.type === 'vip' ? 'VIP' : 'عادی';

    return `مسافر گرامی تاریخ سفر شما ${travelDate} با اتوبوس به شماره پلاک ${plate} با ${company} نوع اتوبوس ${travelType} می‌باشد لذا برای نهایی کردن سفر خود تا 24 ساعت آینده به پایانه مسافربری قزوین ${company} مراجعه نمایید.`;
  }

  // ارسال پیامک (برای تست و حالت اصلی)
  private async sendSingleSms(
    packId: number,
    recipient: Recipient,
    messageText: string,
    adminId: number,
  ): Promise<any> {
    const apiKey = this.configService.get<string>('GHASEDAK_API_KEY');
    const options = {
      method: 'POST',
      url: 'http://api.ghasedaksms.com/v2/sms/send/simple',
      headers: { apikey: apiKey },
      form: {
        message: messageText,
        sender: this.senderNumber,
        receptor: recipient.phone,
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
      console.log('پاسخ قاصدک:', parsedBody);
      let status = 'failed';
      let errorMessage = null;

      if (parsedBody.result === 'success' && parsedBody.messageids > 1000) {
        status = 'success';
      } else {
        errorMessage = parsedBody.message || `خطا از قاصدک: کد ${parsedBody.messageids}`;
      }

      // ذخیره تو دیتابیس
      await this.prisma.smsHistory.create({
        data: {
          packId,
          recipientPhone: recipient.phone,
          recipientType: recipient.type,
          text: messageText,
          sentAt: new Date(),
          status,
          error: errorMessage,
          createdBy: adminId,
        },
      });

      if (status === 'failed') {
        throw new Error(errorMessage || 'خطا در ارسال پیامک');
      }

      return { recipient, status: 'success', response: parsedBody };
    } catch (error: any) {
      console.error(`خطا در ارسال به ${recipient.phone}:`, error.message);
      await this.prisma.smsHistory.create({
        data: {
          packId,
          recipientPhone: recipient.phone,
          recipientType: recipient.type,
          text: messageText,
          sentAt: new Date(),
          status: 'failed',
          error: error.message,
          createdBy: adminId,
        },
      });
      throw error;
    }
  }

  // ارسال پیامک تست
  async sendTestSms(
    packId: number,
    testPhone: string,
    messageText: string,
    adminId: number,
  ): Promise<any> {
    const recipient: Recipient = { phone: testPhone, type: 'test' };
    return this.sendSingleSms(packId, recipient, messageText, adminId);
  }

  // ارسال پیامک (فعلاً غیرفعال تا تست تکمیل بشه)
  async sendSms(
    packId: number,
    sendSmsDto: SendSmsDto,
    adminId: number,
  ): Promise<any> {
    throw new Error('ارسال پیامک به همه اشخاص فعلاً غیرفعال است. لطفاً از دکمه تست استفاده کنید.');
  }

  // گزارش تعداد پیامک‌ها
  async getSmsReport(
    packId: number,
  ): Promise<{ count: number; messages: any[] }> {
    const messages = await this.prisma.smsHistory.findMany({
      where: { packId },
      orderBy: { sentAt: 'desc' },
    });
    const count = messages.length;
    return { count, messages };
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