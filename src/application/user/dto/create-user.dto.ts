import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsHash, IsString } from "class-validator";

export class CreateUserRequestDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsHash('md5')
  password: string;
}
