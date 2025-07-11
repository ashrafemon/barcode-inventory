import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import * as bcrypt from 'bcryptjs';
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { Request } from 'express';
import { ResponseTypes } from 'src/modules/dto/base.dto';

@Injectable()
export class HelperService {
    constructor(
        @Inject(REQUEST) private req: Request,
        private readonly config: ConfigService,
    ) {}

    async entity(
        data: unknown,
        statusCode: number = HttpStatus.OK,
        status: string = ResponseTypes.SUCCESS,
        message?: string,
    ) {
        if (this.config.getOrThrow('APP_DEBUG')) {
            console.log(
                '==========================================================',
            );
            console.dir({
                host: `${this.req.protocol}://${this.req.headers.host}`,
                url: this.req.url,
                method: this.req.method,
                data,
                status,
                statusCode,
            });
            console.log(
                '==========================================================',
            );
        }
        return {
            data,
            message,
            statusCode,
            status,
        };
    }

    exception(
        message: string = '',
        statusCode: number = HttpStatus.NOT_FOUND,
        status: string = ResponseTypes.ERROR,
        data: unknown = null,
    ) {
        if (this.config.getOrThrow('APP_DEBUG')) {
            console.log(
                '==========================================================',
            );
            console.dir({
                host: `${this.req.protocol}://${this.req.headers.host}`,
                url: this.req.url,
                method: this.req.method,
                data,
                message,
                status,
                statusCode,
            });
            console.log(
                '==========================================================',
            );
        }
        throw new HttpException(
            { data, message, statusCode, status },
            statusCode,
        );
    }

    async validateException(
        data: unknown = null,
        message: string = 'Validation error occurred',
    ) {
        if (this.config.getOrThrow('APP_DEBUG')) {
            console.log(
                '==========================================================',
            );
            console.dir({
                host: `${this.req.protocol}://${this.req.headers.host}`,
                url: this.req.url,
                method: this.req.method,
                data,
                message,
                status: ResponseTypes.VALIDATE_ERROR,
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            });
            console.log(
                '==========================================================',
            );
        }
        throw new HttpException(
            {
                data,
                message,
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                status: ResponseTypes.VALIDATE_ERROR,
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
        );
    }

    async serverException(err: Error) {
        if (this.config.getOrThrow('APP_DEBUG')) {
            console.log(
                '==========================================================',
            );
            console.dir({
                host: `${this.req.protocol}://${this.req.headers.host}`,
                url: this.req.url,
                method: this.req.method,
                data: err,
                message: err.message,
                status: ResponseTypes.SERVER_ERROR,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            });
            console.log(
                '==========================================================',
            );
        }
        throw new HttpException(
            {
                data: err,
                message: err.message,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                status: ResponseTypes.SERVER_ERROR,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }

    funcResponser({
        type = ResponseTypes.SUCCESS,
        code = HttpStatus.OK,
        message = '',
        data = null,
    }: {
        type?: ResponseTypes;
        code?: HttpStatus;
        message?: string;
        data?: unknown;
    }) {
        const ok = type === ResponseTypes.SUCCESS ? true : false;
        return { ok, data, message, type, code };
    }

    paginate(
        count: number = 0,
        data: unknown,
        page: number = 1,
        offset: number = 10,
    ) {
        const lastPage = Math.max(1, Math.ceil(Number(count) / Number(offset)));
        const from = (Number(page) - 1) * Number(offset) + 1;
        const to = Math.min(Number(page) * Number(offset), Number(count));

        return {
            result: data,
            meta: {
                current_page: Number(page),
                first_page: 1,
                last_page: lastPage,
                per_page: Number(offset),
                from,
                to,
                total: Number(count),
            },
        };
    }

    generateFields(value: string | string[]) {
        const items = Array.isArray(value)
            ? value.flatMap((v) => v.split(','))
            : value.split(',');
        return items.reduce<{ [key: string]: boolean }>((acc, item) => {
            if (item.trim()) acc[item.trim()] = true;
            return acc;
        }, {});
    }

    generateRelations(value: string | string[]) {
        const toArray = (val: string | string[]) =>
            Array.isArray(val) ? val : [val];

        const relations: {
            [key: string]: { select: { [key: string]: boolean } } | boolean;
        } = {};

        toArray(value).forEach((item) => {
            const [key, fields] = item.split(':');
            if (fields && fields.trim()) {
                const select = fields
                    .split(',')
                    .reduce<{ [k: string]: boolean }>((acc, f) => {
                        if (f.trim()) acc[f.trim()] = true;
                        return acc;
                    }, {});
                relations[key] = { select };
            } else {
                relations[key] = true;
            }
        });

        return relations;
    }

    getPageOffset(
        page: string | number | null | undefined,
        offset: string | number | null | undefined,
    ) {
        const p = page ? +page : 1;
        const o = offset ? +offset : 10;
        return { page: p, offset: o, skip: (p - 1) * o, take: o };
    }

    getFieldRelations(
        fields: string | string[] | null | undefined,
        relations: string | string[] | null | undefined,
    ) {
        const result: Record<string, any> = {};
        if (fields) Object.assign(result, this.generateFields(fields));
        if (relations) Object.assign(result, this.generateRelations(relations));
        return result;
    }

    async hashMake(
        content: string,
        salt: number = this.config.getOrThrow('HASH_SALT_ROUND', 10),
    ) {
        const salting = await bcrypt.genSalt(Number(salt));
        return await bcrypt.hash(content, salting);
    }

    async hashCheck(text: string, hash: string) {
        return await bcrypt.compare(text, hash);
    }

    dateTime = (val?: string | Date | null) => {
        dayjs.extend(utc);
        dayjs.extend(timezone);

        if (val) {
            return dayjs(val).tz(
                this.config.getOrThrow('APP_TIMEZONE', 'Asia/Dhaka'),
            );
        }
        return dayjs().tz(this.config.getOrThrow('APP_TIMEZONE', 'Asia/Dhaka'));
    };
}
