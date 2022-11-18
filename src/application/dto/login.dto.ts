import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDTO {
  @ApiProperty({
    required: true,
  })
  username: string;

  @ApiProperty({
    required: true,
  })
  password: string;
}
