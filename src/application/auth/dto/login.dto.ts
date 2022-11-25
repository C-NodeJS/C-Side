import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginRequestDTO {
  @ApiProperty({
    required: true,
  })
  emailOrPhoneNumber: string;

  @ApiProperty({
    required: true,
  })
  password: string;
}
