import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('health')
export class AppController {
  constructor() {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getHello(): string {
    return 'OK~~!';
  }
}
