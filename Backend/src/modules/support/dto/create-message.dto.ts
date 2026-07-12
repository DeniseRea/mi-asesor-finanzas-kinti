export class CreateMessageDto {
  content: string;
  role?: string; // e.g. 'user' or 'agent'
}
