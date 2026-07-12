import { IsString } from 'class-validator';

export class CreateKbEntryDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  category: string;
}
