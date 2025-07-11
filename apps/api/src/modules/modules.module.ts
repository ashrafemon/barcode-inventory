import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ApiModule } from './api/api.module';
import { DatabaseModule } from './database/database.module';
import { UtilsModule } from './utils/utils.module';
import { ValidationPipe } from './utils/validation/validation.pipe';

@Module({
    imports: [DatabaseModule, UtilsModule, ApiModule],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ],
})
export class ModulesModule {}
