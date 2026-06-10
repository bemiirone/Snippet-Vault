import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let storageMock: Storage;

  beforeEach(() => {
    storageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };

    vi.stubGlobal('localStorage', storageMock);
    service = new AuthService();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('hasKey', () => {
    it('should return false when no key in localStorage', () => {
      vi.mocked(storageMock.getItem).mockReturnValue(null);
      const freshService = new AuthService();
      expect(freshService.hasKey()).toBe(false);
    });

    it('should return true when key exists in localStorage', () => {
      vi.mocked(storageMock.getItem).mockReturnValue('test-key');
      const freshService = new AuthService();
      expect(freshService.hasKey()).toBe(true);
    });
  });

  describe('getKey', () => {
    it('should return key from localStorage', () => {
      vi.mocked(storageMock.getItem).mockReturnValue('my-api-key');
      expect(service.getKey()).toBe('my-api-key');
      expect(storageMock.getItem).toHaveBeenCalledWith('vault_api_key');
    });

    it('should return null when no key exists', () => {
      vi.mocked(storageMock.getItem).mockReturnValue(null);
      expect(service.getKey()).toBeNull();
    });
  });

  describe('setKey', () => {
    it('should store key in localStorage', () => {
      service.setKey('new-api-key');
      expect(storageMock.setItem).toHaveBeenCalledWith('vault_api_key', 'new-api-key');
    });

    it('should update hasKey signal to true', () => {
      service.setKey('new-api-key');
      expect(service.hasKey()).toBe(true);
    });
  });

  describe('clearKey', () => {
    it('should remove key from localStorage', () => {
      service.clearKey();
      expect(storageMock.removeItem).toHaveBeenCalledWith('vault_api_key');
    });

    it('should update hasKey signal to false', () => {
      service.clearKey();
      expect(service.hasKey()).toBe(false);
    });
  });
});
