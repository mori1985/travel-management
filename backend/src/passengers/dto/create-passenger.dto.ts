import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreatePassengerDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  gender: string;

  @IsString()
  phone: string;

  @IsString()
  nationalCode: string;

  @IsDateString()
  travelDate: string;

  @IsDateString()
  @IsOptional()
  returnDate?: string;

  @IsDateString()
  birthDate: string;

  @IsString()
  travelType: string;

  @IsString()
  @IsOptional()
  leaderName?: string;

  @IsString()
  @IsOptional()
  leaderPhone?: string;

  @IsOptional()
  packId?: number;
}