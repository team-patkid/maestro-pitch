import rTracer from 'cls-rtracer';
import { LogLevel } from './enum/log.enum';

export class LogProvider {
  constructor() {}

  static info(ctx: Record<string, any>, method: string) {
    console.log({
      requestId: rTracer.id(),
      message: ctx,
      method,
      level: LogLevel.INFO,
    });
  }
}
