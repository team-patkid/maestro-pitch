import { LogProvider } from './logProvider';
import rTracer from 'cls-rtracer';
import * as Sentry from '@sentry/node';

export class ReportProvider {
  static report(data: {
    ctx?: Record<string, any>;
    error?: any;
    method: string;
  }) {
    Sentry.withScope((scope) => {
      if (data.ctx) {
        for (const key in data.ctx) {
          scope.setExtra(key, data.ctx[key]);
        }
      }
      scope.setExtra('method', data.method);
      scope.setExtra('requestId', rTracer.id());

      Sentry.captureException(
        data.error ? data.error.message : `error ${data.method}`,
      );
    });
  }

  static reportWithLog(data: {
    ctx?: Record<string, any>;
    error?: any;
    method: string;
  }) {
    LogProvider.error(data.ctx ?? {}, data.method);
    ReportProvider.report(data);
  }
}
