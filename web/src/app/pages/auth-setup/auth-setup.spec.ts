import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthSetup } from './auth-setup';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

describe('AuthSetup', () => {
  let authServiceMock: { setKey: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    TestBed.resetTestingModule();
    authServiceMock = { setKey: vi.fn() };
    routerMock = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      imports: [AuthSetup],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AuthSetup);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialize with empty key', () => {
    const fixture = TestBed.createComponent(AuthSetup);
    expect(fixture.componentInstance['key']()).toBe('');
  });

  it('should initialize with empty error', () => {
    const fixture = TestBed.createComponent(AuthSetup);
    expect(fixture.componentInstance['error']()).toBe('');
  });

  describe('submit', () => {
    it('should do nothing if key is empty', async () => {
      const fixture = TestBed.createComponent(AuthSetup);
      await fixture.componentInstance['submit']();
      expect(authServiceMock.setKey).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should do nothing if key is only whitespace', async () => {
      const fixture = TestBed.createComponent(AuthSetup);
      fixture.componentInstance['key'].set('   ');
      await fixture.componentInstance['submit']();
      expect(authServiceMock.setKey).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should set key and navigate on valid submit', async () => {
      const fixture = TestBed.createComponent(AuthSetup);
      fixture.componentInstance['key'].set('sk_test_key');
      await fixture.componentInstance['submit']();
      expect(authServiceMock.setKey).toHaveBeenCalledWith('sk_test_key');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should trim key before saving', async () => {
      const fixture = TestBed.createComponent(AuthSetup);
      fixture.componentInstance['key'].set('  sk_test_key  ');
      await fixture.componentInstance['submit']();
      expect(authServiceMock.setKey).toHaveBeenCalledWith('sk_test_key');
    });
  });
});
