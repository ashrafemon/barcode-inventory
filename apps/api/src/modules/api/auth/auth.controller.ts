import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { RequestWithAuth } from 'src/modules/dto/base.dto';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.CREATED)
    login(@Body() body: LoginDto) {
        return this.service.login(body);
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() body: RegisterDto) {
        return this.service.register(body);
    }

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    me(@Req() req: RequestWithAuth) {
        const { id } = req.auth;
        return this.service.me(id);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    logout(@Req() req: Request) {
        const [_, token] = req.headers.authorization?.split(' ') ?? [];
        return this.service.logout(token);
    }
}
