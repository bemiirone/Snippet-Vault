import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    service = new ConfigService();
  });

  it('should initialize with empty apiUrl', () => {
    expect(service.apiUrl()).toBe('');
  });

  describe('loadConfig', () => {
    it('should load config from /config.json', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ apiUrl: 'http://localhost:3000' }),
      });
      vi.stubGlobal('fetch', mockFetch);

      await service.loadConfig();

      expect(mockFetch).toHaveBeenCalledWith('/config.json');
      expect(service.apiUrl()).toBe('http://localhost:3000');

      vi.unstubAllGlobals();
    });
  });
});
