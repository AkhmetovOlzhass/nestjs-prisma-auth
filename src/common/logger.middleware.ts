import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;

      let log = `[${method}] ${originalUrl} - ${statusCode} (${duration}ms)`;

      if (originalUrl.includes('/graphql') && req.body) {
        const { operationName, query } = req.body;
        const op = operationName || query?.split('{')?.[0]?.trim();
        if (op) log += ` - Operation: ${op}`;
      }

      console.log(log);
    });

    next();
  }
}
