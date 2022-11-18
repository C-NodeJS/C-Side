import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterPayload } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @ApiResponse({ status: 1000, description: 'Success!' })
  @ApiResponse({ status: 9001, description: 'Failed' })
  async register(@Body() payload: RegisterPayload): Promise<any> {
    return await this.authService.register(payload);
  }
}
