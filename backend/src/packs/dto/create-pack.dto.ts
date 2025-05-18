import { IsString, IsDateString, IsInt, IsIn } from 'class-validator';

export class CreatePackDto {
  @IsDateString()
  travelDate: string;

  @IsString()
  @IsIn(['normal', 'vip'])
  type: string;

  @IsInt()
  @IsIn([1, 2, 3])
  repository: number;
}