import { APP_INITIALIZER, Provider } from '@angular/core';
import { ConfigService } from './config.service';

export function initConfig(config: ConfigService): () => Promise<void> {
  return () => config.loadConfig();
}

export const configProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initConfig,
  deps: [ConfigService],
  multi: true,
};
