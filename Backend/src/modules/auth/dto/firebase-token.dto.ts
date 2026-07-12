import { IsString } from 'class-validator';

export class FirebaseTokenDto {
  @IsString()
  idToken: string;
}
