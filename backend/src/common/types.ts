export interface PassengerResponse {
  id: number;
  firstName: string;
  lastName: string;
  nationalCode: string;
  phone: string;
  stage: 'registered' | 'in-pack' | 'bus-assigned' | 'final-confirmed';
  stageText: string;
  packId?: number;
  travelType: 'normal' | 'vip'; // نوع پک
  travelDate: string; // تاریخ رفت
  returnDate?: string; // تاریخ برگشت
  birthDate?: string; // تاریخ تولد
}