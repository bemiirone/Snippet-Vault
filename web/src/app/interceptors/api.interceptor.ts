import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/config.json')) {
    return next(req);
  }

  const config = inject(ConfigService);
  const auth = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  const apiUrl = config.apiUrl().replace(/\/+$/, '');
  const key = auth.getKey();

  const apiReq = req.clone({
    url: `${apiUrl}/api/${req.url.replace(/^\/?api\//, '')}`,
    setHeaders: key ? { Authorization: `Bearer ${key}` } : {},
  });

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        router.navigate(['/setup']);
      } else if (error.status >= 500) {
        messageService.add({
          severity: 'error',
          summary: 'Server Error',
          detail: 'Something went wrong. Please try again later.',
        });
      } else if (error.status === 0) {
        messageService.add({
          severity: 'error',
          summary: 'Network Error',
          detail: 'Unable to connect to the server. Check your connection.',
        });
      }
      return throwError(() => error);
    })
  );
};
