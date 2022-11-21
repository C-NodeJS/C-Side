import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginRequestDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOkResponse({ description: 'Login success' })
  @ApiUnauthorizedResponse({ description: 'Login fail' })
  async login(@Body() loginRequestDto: LoginRequestDTO): Promise<any> {
    return await this.authService.login(loginRequestDto);
  }
}
