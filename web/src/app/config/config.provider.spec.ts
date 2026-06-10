import { TestBed } from '@angular/core/testing';
import { APP_INITIALIZER } from '@angular/core';
import { configProvider, initConfig } from './config.provider';
import { ConfigService } from './config.service';

describe('configProvider', () => {
  it('should provide APP_INITIALIZER', () => {
    expect(configProvider).toEqual({
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigService],
      multi: true,
    });
  });
});

describe('initConfig', () => {
  it('should return a function that calls loadConfig', async () => {
    const configServiceMock = { loadConfig: vi.fn().mockResolvedValue(undefined) };
    const factoryFn = initConfig(configServiceMock as unknown as ConfigService);
    await factoryFn();
    expect(configServiceMock.loadConfig).toHaveBeenCalled();
  });
});
