import { IsString, IsDateString, IsOptional, IsInt, IsIn } from 'class-validator';

export class CreatePassengerDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsString()
  gender: string;

  @IsString()
  phone: string;

  @IsString()
  nationalId: string;

  @IsDateString()
  travelDate: string;

  @IsDateString()
  @IsOptional()
  returnDate?: string;

  @IsDateString()
  birthDate: string;

  @IsString()
  @IsIn(['normal', 'vip'])
  travelType: string;

  @IsString()
  @IsOptional()
  leaderName?: string;

  @IsString()
  @IsOptional()
  leaderPhone?: string;

  @IsInt()
  @IsOptional()
  packId?: number;
}