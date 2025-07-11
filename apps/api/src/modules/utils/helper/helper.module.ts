import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelperService } from './helper.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
    imports: [ConfigModule, JwtModule],
    providers: [HelperService],
    exports: [HelperService],
})
export class HelperModule {}
