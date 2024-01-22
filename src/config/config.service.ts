import { Injectable } from '@nestjs/common';
import { Configuration } from './type/config.type';
import { config } from './Dev';
import { SupportNodeEnv } from './enum/config.enum';

@Injectable()
export class ConfigService {
  constructor() {}

  static getConfig(): Configuration {
    switch (process.env.NODE_ENV) {
      case SupportNodeEnv.DEV:
        return config;
        break;
      default:
        return config;
    }
  }
}
