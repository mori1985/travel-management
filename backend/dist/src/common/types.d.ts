export interface PassengerResponse {
    id: number;
    firstName: string;
    lastName: string;
    nationalCode: string;
    phone: string;
    stage: 'registered' | 'in-pack' | 'bus-assigned' | 'final-confirmed';
    stageText: string;
    packId?: number;
    travelType: 'normal' | 'vip';
    travelDate: string;
    returnDate?: string;
    birthDate?: string;
    smsStatus?: string;
}
