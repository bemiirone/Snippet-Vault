import { TestBed } from '@angular/core/testing';
import { configResolver } from './config.provider';
import { ConfigService } from './config.service';

describe('configResolver', () => {
  it('should call loadConfig on ConfigService', async () => {
    const configServiceMock = { loadConfig: vi.fn().mockResolvedValue(undefined) };

    TestBed.configureTestingModule({
      providers: [{ provide: ConfigService, useValue: configServiceMock }],
    });

    await TestBed.runInInjectionContext(() => configResolver());

    expect(configServiceMock.loadConfig).toHaveBeenCalled();
  });
});
