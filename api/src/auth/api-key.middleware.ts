// api/src/auth/api-key.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const apiKey = process.env['VAULT_API_KEY'];

    // ENFORCE: API key must be configured
    if (!apiKey) {
      throw new Error(
        'VAULT_API_KEY environment variable is not set! ' +
        'Set it in .env file or server environment variables.'
      );
    }

    // ENFORCE: Authorization header required
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    // ENFORCE: Token must match
    if (token !== apiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    next();
  }
}