import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('init')
  async initial(): Promise<string> {
    console.log('Init data');
    return await this.appService.seed();
  }
}
