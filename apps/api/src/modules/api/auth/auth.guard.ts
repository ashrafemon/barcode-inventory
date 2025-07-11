import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { DatabaseService } from 'src/modules/database/database.service';
import { ResponseTypes } from 'src/modules/dto/base.dto';
import { HelperService } from 'src/modules/utils/helper/helper.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly db: DatabaseService,
        private readonly helper: HelperService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const skipAuth = this.reflector.getAllAndOverride<boolean>('skip', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (skipAuth) return true;

        const unauthorizedResponse = {
            message: 'Sorry, You are unauthenticated',
            statusCode: HttpStatus.UNAUTHORIZED,
            status: ResponseTypes.ERROR,
            data: null,
        };

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException(unauthorizedResponse);
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.getOrThrow('JWT_SECRET'),
            });

            const doc = await this.db.token.findFirst({
                where: {
                    token,
                    status: 'RUNNING',
                    valid_at: { gte: this.helper.dateTime().toDate() },
                },
            });

            if (!doc) {
                await this.db.token.deleteMany({ where: { token } });
                throw new UnauthorizedException(unauthorizedResponse);
            }
            request['auth'] = payload;
        } catch {
            throw new UnauthorizedException(unauthorizedResponse);
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
