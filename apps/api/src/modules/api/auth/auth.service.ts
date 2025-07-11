import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { HelperService } from 'src/modules/utils/helper/helper.service';
import { LoginDto, RegisterDto, TokenStatus } from './auth.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ResponseTypes } from 'src/modules/dto/base.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly db: DatabaseService,
        private readonly helper: HelperService,
        private readonly config: ConfigService,
        private readonly jwt: JwtService,
    ) {}

    async login(body: LoginDto) {
        try {
            const user = await this.db.user.findFirst({
                where: { email: body.email },
            });
            if (!user) {
                return this.helper.validateException({
                    email: 'User not found by this email',
                });
            }

            const isPasswordMatch = await this.helper.hashCheck(
                body.password,
                user.password,
            );
            if (!isPasswordMatch) {
                return this.helper.validateException({
                    password: 'The password is wrong',
                });
            }

            const res = await this.tokenGenerate({ id: user.id });
            if (!res.ok && res.type === ResponseTypes.ERROR) {
                return this.helper.exception(res.message, res.code);
            }
            if (!res.ok && res.type === ResponseTypes.SERVER_ERROR) {
                return this.helper.serverException(res.data as Error);
            }

            return this.helper.entity(
                res.data,
                res.code,
                res.type,
                "You've logged into your account successfully.",
            );
        } catch (err) {
            return this.helper.serverException(err);
        }
    }

    async register(body: RegisterDto) {
        try {
            const exist = await this.db.user.count({
                where: { email: body.email },
            });
            if (exist) {
                return this.helper.validateException({
                    email: 'This email is already in used',
                });
            }

            const password = await this.helper.hashMake(body.password);
            await this.db.user.create({
                data: { ...body, password },
            });

            return this.helper.entity(
                null,
                HttpStatus.CREATED,
                ResponseTypes.SUCCESS,
                'User registration successful',
            );
        } catch (err) {
            return this.helper.serverException(err);
        }
    }

    async logout(token: string) {
        try {
            const doc = await this.db.token.findFirst({
                where: { token },
            });
            if (!doc) {
                return this.helper.exception('Token not found');
            }

            await this.db.token.update({
                where: { id: doc.id },
                data: { status: TokenStatus.BLACKLIST },
            });

            return this.helper.entity(
                null,
                HttpStatus.OK,
                ResponseTypes.SUCCESS,
                'Logout successful',
            );
        } catch (err) {
            return this.helper.serverException(err);
        }
    }

    async me(id: string) {
        try {
            const doc = await this.db.user.findFirst({
                where: { id },
                omit: { created_at: true, updated_at: true, password: true },
            });

            if (!doc) {
                return this.helper.exception('User information not found');
            }

            return this.helper.entity(doc);
        } catch (err) {
            return this.helper.serverException(err);
        }
    }

    async tokenGenerate(
        claims: Record<string, any>,
        isRemember: boolean = false,
    ) {
        try {
            const secret = this.config.getOrThrow('JWT_SECRET');
            const algorithm = this.config.getOrThrow('JWT_ALG', 'HS256');
            const issuer = this.config.getOrThrow('APP_NAME', 'INVENTORY');
            const audience = this.config.getOrThrow('APP_NAME', 'INVENTORY');

            const timeDuration = isRemember
                ? this.config.getOrThrow('JWT_MAX_DURATION', '2h')
                : this.config.getOrThrow('JWT_MIN_DURATION', '30m');
            const refreshTimeDuration = this.config.getOrThrow(
                'JWT_REFRESH_DURATION',
                '1d',
            );

            const [token, refresh] = await Promise.all([
                this.jwt.signAsync(
                    { ...claims },
                    {
                        algorithm,
                        audience,
                        issuer,
                        secret,
                        expiresIn: timeDuration,
                    },
                ),
                this.jwt.signAsync(
                    { ...claims, is_refresh: true },
                    {
                        algorithm,
                        audience,
                        issuer,
                        secret,
                        expiresIn: refreshTimeDuration,
                    },
                ),
            ]);

            if (!token || !refresh) {
                return this.helper.funcResponser({
                    type: ResponseTypes.ERROR,
                    code: HttpStatus.BAD_REQUEST,
                    message: 'Sorry, token is not generate successfully',
                });
            }

            await this.db.token.create({
                data: {
                    token,
                    valid_at: this.helper.dateTime().add(2, 'hours').toDate(),
                },
            });

            return this.helper.funcResponser({
                code: HttpStatus.CREATED,
                data: { token, refresh, type: 'Bearer' },
            });
        } catch (err) {
            return this.helper.funcResponser({
                type: ResponseTypes.SERVER_ERROR,
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                data: err,
            });
        }
    }
}
