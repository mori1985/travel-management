import { IsString, IsDateString, IsInt, IsIn, IsOptional } from 'class-validator';

export class UpdatePackDto {
  @IsDateString()
  @IsOptional()
  travelDate?: string;

  @IsString()
  @IsIn(['normal', 'vip'])
  @IsOptional()
  type?: string;

  @IsInt()
  @IsIn([1, 2, 3])
  @IsOptional()
  repository?: number;

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