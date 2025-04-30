import { IsString, IsDateString, IsInt, IsIn, IsOptional } from 'class-validator';

export class CreatePackDto {
  @IsDateString()
  travelDate: string;

  @IsString()
  @IsIn(['normal', 'vip'])
  type: string;

  @IsInt()
  @IsIn([1, 2, 3])
  repository: number;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  plate?: string;

  @IsString()
  @IsOptional()
  driver?: string;

  @IsString()
  @IsOptional()
  driverPhone?: string;
}