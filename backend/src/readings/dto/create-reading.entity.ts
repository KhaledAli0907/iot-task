import { IsNumber, IsString } from 'class-validator';

export class CreateReadingDto {
  @IsString()
  sensor: string;

  @IsNumber()
  value: number;
}
