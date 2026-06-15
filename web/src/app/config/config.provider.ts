import { inject } from '@angular/core';
import { ConfigService } from './config.service';

/**
 * Route resolver that loads app config before navigation.
 * Replaces deprecated APP_INITIALIZER pattern.
 */
export function configResolver() {
  const configService = inject(ConfigService);
  return configService.loadConfig();
}
