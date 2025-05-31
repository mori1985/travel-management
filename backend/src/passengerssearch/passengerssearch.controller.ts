import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PassengersSearchService } from './passengerssearch.service';
import { PassengerResponse } from '../common/types'; // ایمپورت از فایل مشترک

@Controller('passengers')
export class PassengersSearchController {
  constructor(
    private readonly passengersSearchService: PassengersSearchService,
  ) {}

  @Get('search')
  async searchPassengerByNationalCode(
    @Query('nationalCode') nationalCode: string,
  ): Promise<PassengerResponse> {
    if (
      !nationalCode ||
      nationalCode.length !== 10 ||
      isNaN(Number(nationalCode))
    ) {
      throw new HttpException(
        'کد ملی باید ۱۰ رقم باشد',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.passengersSearchService.searchPassengerByNationalCode(
      nationalCode,
    );
  }
}
