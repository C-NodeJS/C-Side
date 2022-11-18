import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Match } from '../../common/match.validator';

export class RegisterPayload {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  password: string;
}
