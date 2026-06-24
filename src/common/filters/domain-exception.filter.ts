import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    const error = exception as Error;
    const name = error?.name ?? '';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (name.endsWith('NotFound')) {
      status = HttpStatus.NOT_FOUND;
    } else if (name.endsWith('AlreadyExists')) {
      status = HttpStatus.BAD_REQUEST;
    } else if (name.endsWith('NotAllowed')) {
      status = HttpStatus.FORBIDDEN;
    } else if (name === 'InvalidProductPrice') {
      status = HttpStatus.BAD_REQUEST;
    }

    const message =
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Erro interno do servidor'
        : error.message;

    response.status(status).json({ statusCode: status, message });
  }
}
