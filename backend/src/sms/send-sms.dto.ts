import { IsString, IsArray } from 'class-validator';

export class SendSmsDto {
  @IsArray()
  selectedCompanies: string[];

  @IsArray()
  selectedResponsibles: string[];

  @IsString()
  messageText: string;
}