import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @Public()
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
