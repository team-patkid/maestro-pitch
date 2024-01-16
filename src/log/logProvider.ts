import rTracer from 'cls-rtracer';
import { LogLevel } from './enum/log.enum';

export class LogProvider {
  constructor() {}

  static info(ctx: Record<string, any>, method: string) {
    console.log({
      requestId: rTracer.id(),
      ctx,
      method,
      level: LogLevel.INFO,
    });
  }

  static error(ctx: Record<string, any>, method: string): void {
    console.log({
      ...(rTracer.id() ? { requestId: rTracer.id() } : {}),
      method,
      ctx,
      level: LogLevel.ERROR,
    });
  }
}
