import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { AuthService } from '../services/auth.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/config.json')) {
    return next(req);
  }

  const config = inject(ConfigService);
  const auth = inject(AuthService);

  const apiUrl = config.apiUrl().replace(/\/+$/, '');
  const key = auth.getKey();

  const apiReq = req.clone({
    url: `${apiUrl}/api/${req.url.replace(/^\/?api\//, '')}`,
    setHeaders: key ? { Authorization: `Bearer ${key}` } : {},
  });

  return next(apiReq);
};
