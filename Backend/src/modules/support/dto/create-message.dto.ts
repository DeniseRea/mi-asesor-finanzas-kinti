import { IsString, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  role?: string; // e.g. 'user' or 'agent'
}
