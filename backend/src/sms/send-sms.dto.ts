import { IsString, IsArray, IsOptional } from 'class-validator';

export class SendSmsDto {
  @IsArray()
  selectedCompanies: string[];

  @IsArray()
  selectedResponsibles: string[];

  @IsString()
  messageText: string;

  @IsOptional()
  @IsString()
  testPhone?: string;
}