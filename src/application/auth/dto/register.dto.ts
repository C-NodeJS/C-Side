import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterRequestDTO {
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

  @ApiProperty({
    required: false,
  })
  name: string;

  @ApiProperty({
    required: false,
  })
  phone: string;

  @ApiProperty({
    required: false,
  })
  address: string;

  @ApiProperty({
    required: false,
  })
  roleId: number;
}
