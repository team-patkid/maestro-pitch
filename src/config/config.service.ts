import { Injectable } from '@nestjs/common';
import { Configuration } from './type/config.type';
import dev from './Dev';
import local from './Local';
import { SupportNodeEnv } from './enum/config.enum';

@Injectable()
export class ConfigService {
  constructor() {}

  static getConfig(): Configuration {
    switch (process.env.NODE_ENV) {
      case SupportNodeEnv.LOCAL:
        return local;
      case SupportNodeEnv.DEV:
        return dev;
      default:
        return dev;
    }
  }
}
