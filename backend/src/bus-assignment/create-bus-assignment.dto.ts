import { IsString, Matches, IsNotEmpty } from 'class-validator';

export class CreateBusAssignmentDto {
  @IsString()
  @IsNotEmpty({ message: 'نام شرکت الزامی است' })
  company: string;

  @IsString()
  @IsNotEmpty({ message: 'پلاک الزامی است' })
  @Matches(/^\d{3}-[آ-یا-ی]{1}-\d{2}$/, {
    message: 'فرمت پلاک باید مثل ۱۲۳-ج-۴۵ باشد',
  })
  plate: string;

  @IsString()
  @IsNotEmpty({ message: 'نام راننده الزامی است' })
  driver: string;

  @IsString()
  @IsNotEmpty({ message: 'شماره موبایل راننده الزامی است' })
  @Matches(/^09\d{9}$/, {
    message: 'فرمت شماره موبایل باید مثل 09123456789 باشد',
  })
  driverPhone: string;
}