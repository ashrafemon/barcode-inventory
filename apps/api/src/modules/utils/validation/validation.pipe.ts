import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { ResponseTypes } from 'src/modules/dto/base.dto';

@Injectable({ scope: Scope.REQUEST })
export class ValidationPipe implements PipeTransform<any> {
  constructor(@Inject(REQUEST) private readonly req: Request) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const contentType = this.req.headers?.['content-type'];
    if (contentType?.includes('multipart/form-data')) {
      return value;
    }

    const isEmptyVal =
      !value || (typeof value === 'object' && !Object.keys(value).length);

    if (metadata.type === 'body' && isEmptyVal) {
      throw new BadRequestException({
        message: 'Request body is required',
        status: ResponseTypes.ERROR,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value, {
      enableImplicitConversion: true,
    });
    const errors = await validate(object);
    const data: Record<string, string> = {};
    let vKey = '';
    errors.forEach((item, i) => {
      if (i === 0) vKey = item.property;
      if (item.constraints) {
        Object.keys(item.constraints).forEach((key) => {
          if (item.constraints) {
            data[item.property] = item.constraints[key];
          }
        });
      }
    });

    if (errors.length > 0) {
      throw new HttpException(
        {
          data,
          // message: data[vKey],
          message: 'Validation error occurred',
          status: ResponseTypes.VALIDATE_ERROR,
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return object;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
