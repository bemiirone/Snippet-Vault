import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { apiInterceptor } from './api.interceptor';
import { ConfigService } from '../config/config.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

describe('apiInterceptor', () => {
  let configServiceMock: { apiUrl: ReturnType<typeof vi.fn> };
  let authServiceMock: { getKey: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let messageServiceMock: { add: ReturnType<typeof vi.fn> };

  const createRequest = (url: string) =>
    new HttpRequest('GET', url);

  beforeEach(() => {
    TestBed.resetTestingModule();
    configServiceMock = { apiUrl: vi.fn().mockReturnValue('http://localhost:3000') };
    authServiceMock = { getKey: vi.fn().mockReturnValue('test-key') };
    routerMock = { navigate: vi.fn() };
    messageServiceMock = { add: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useValue: configServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MessageService, useValue: messageServiceMock },
      ],
    });
  });

  it('should pass through config.json requests without modification', () => {
    TestBed.runInInjectionContext(() => {
      const req = createRequest('/config.json');
      let capturedReq: HttpRequest<unknown>;
      const mockNext: HttpHandlerFn = (r) => {
        capturedReq = r;
        return of({} as any);
      };
      apiInterceptor(req, mockNext);
      expect(capturedReq!.url).toBe('/config.json');
    });
  });

  it('should prepend API URL to request', () => {
    TestBed.runInInjectionContext(() => {
      const req = createRequest('/api/snippets');
      let capturedReq: HttpRequest<unknown>;
      const mockNext: HttpHandlerFn = (r) => {
        capturedReq = r;
        return of({} as any);
      };
      apiInterceptor(req, mockNext);
      expect(capturedReq!.url).toBe('http://localhost:3000/api/snippets');
    });
  });

  it('should add Authorization header when key exists', () => {
    TestBed.runInInjectionContext(() => {
      const req = createRequest('/api/snippets');
      let capturedReq: HttpRequest<unknown>;
      const mockNext: HttpHandlerFn = (r) => {
        capturedReq = r;
        return of({} as any);
      };
      apiInterceptor(req, mockNext);
      expect(capturedReq!.headers.get('Authorization')).toBe('Bearer test-key');
    });
  });

  it('should not add Authorization header when key is null', () => {
    authServiceMock.getKey.mockReturnValue(null);
    TestBed.runInInjectionContext(() => {
      const req = createRequest('/api/snippets');
      let capturedReq: HttpRequest<unknown>;
      const mockNext: HttpHandlerFn = (r) => {
        capturedReq = r;
        return of({} as any);
      };
      apiInterceptor(req, mockNext);
      expect(capturedReq!.headers.get('Authorization')).toBeNull();
    });
  });

  it('should navigate to /setup on 401 error', () => {
    TestBed.runInInjectionContext(() => {
      const req = createRequest('/api/snippets');
      const mockNext: HttpHandlerFn = () =>
        throwError(() => new HttpErrorResponse({ status: 401 }));
      apiInterceptor(req, mockNext).subscribe({
        error: () => {},
      });
      expect(routerMock.navigate).toHaveBeenCalledWith(['/setup']);
    });
  });

  it('should show server error message on 500+ error', () => {
    TestBed.runInInjectionContext(() => {
      const req = createRequest('/api/snippets');
      const mockNext: HttpHandlerFn = () =>
        throwError(() => new HttpErrorResponse({ status: 500 }));
      apiInterceptor(req, mockNext).subscribe({
        error: () => {},
      });
      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Server Error',
        detail: 'Something went wrong. Please try again later.',
      });
    });
  });

  it('should show network error message on status 0', () => {
    TestBed.runInInjectionContext(() => {
      const req = createRequest('/api/snippets');
      const mockNext: HttpHandlerFn = () =>
        throwError(() => new HttpErrorResponse({ status: 0 }));
      apiInterceptor(req, mockNext).subscribe({
        error: () => {},
      });
      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Network Error',
        detail: 'Unable to connect to the server. Check your connection.',
      });
    });
  });

  it('should rethrow errors', () => {
    TestBed.runInInjectionContext(() => {
      const req = createRequest('/api/snippets');
      const error = new HttpErrorResponse({ status: 500 });
      const mockNext: HttpHandlerFn = () => throwError(() => error);
      let emittedError: unknown;
      apiInterceptor(req, mockNext).subscribe({
        next: () => {},
        error: (err) => { emittedError = err; },
      });
      expect(emittedError).toBe(error);
    });
  });
});
