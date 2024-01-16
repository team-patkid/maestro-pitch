import { LogProvider } from './logProvider';
import * as Sentry from '@sentry/node';

export class ReportProvider {
  static report(data: {
    ctx?: Record<string, any>;
    error?: any;
    method: string;
  }) {
    LogProvider.error(data.ctx ?? {}, data.method);

    Sentry.withScope((scope) => {
      if (data.ctx) {
        for (const key in data.ctx) {
          scope.setExtra(key, data.ctx[key]);
        }
      }
      scope.setExtra('method', data.method);
      Sentry.captureException(
        data.error ? data.error.message : `error ${data.method}`,
      );
    });
  }
}
