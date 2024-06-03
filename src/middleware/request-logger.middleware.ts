import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestsLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    const { ip, method, path: url } = request;
    const userAgent = request.get('user-agent') || '';

    const startTime = performance.now();

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const endTime = performance.now();
      const resTime = endTime - startTime;

      const white = '\x1b[37m';
      const green = '\x1b[32m';
      const red = '\x1b[31m';

      const errorResponse = /[45]\d{2}/.test(statusCode.toString()); 

      this.logger.log(
        `${errorResponse ? red : white} 🚀 ${method} ${url} ${statusCode} length: ${contentLength} - ${userAgent} ${ip} - ${resTime}ms`,
      );
      this.logger.log(
        `${errorResponse ? `${red} ❌` : `${green} ✅`} Request Body: ${JSON.stringify(request.body, null, 2)}`,
      );
    });

    next();
  }
}