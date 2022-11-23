import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDTO {
  @ApiProperty({
    required: true,
  })
  userName: string;

  @ApiProperty({
    required: true,
  })
  password: string;
}
