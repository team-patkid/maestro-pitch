import rTracer from 'cls-rtracer';
import { LogLevel } from './enum/log.enum';

export class LogProvider {
  constructor() {}

  static info(ctx: Record<string, any>, method: string) {
    console.log(
      JSON.stringify({
        requestId: rTracer.id(),
        ctx,
        method,
        level: LogLevel.INFO,
      }),
    );
  }

  static error(ctx: Record<string, any>, method: string): void {
    console.log(
      JSON.stringify({
        ...(rTracer.id() ? { requestId: rTracer.id() } : {}),
        method,
        ctx,
        level: LogLevel.ERROR,
      }),
    );
  }
}
