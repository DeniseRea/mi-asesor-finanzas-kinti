import { IsString, IsOptional } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  subject: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  context?: string;
}
