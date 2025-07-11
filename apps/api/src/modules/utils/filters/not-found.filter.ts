import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
    NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseTypes } from 'src/modules/dto/base.dto';

@Catch(NotFoundException)
export class NotFoundFilter<T> implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response.status(HttpStatus.NOT_FOUND).json({
            message: `${response.req.url} of ${response.req.method} method route not found...`,
            status: ResponseTypes.ERROR,
            statusCode: HttpStatus.NOT_FOUND,
        });
    }
}
