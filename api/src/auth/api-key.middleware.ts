import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const apiKey = process.env['VAULT_API_KEY'];

    if (!apiKey) {
      return next();
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing API key');
    }

    const token = authHeader.split(' ')[1];
    if (token !== apiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    next();
  }
}
