import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('health')
export class AppController {
  constructor() {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getHello(): string {
    return 'OK~~!';
  }
}
