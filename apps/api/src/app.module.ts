import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { ModulesModule } from './modules/modules.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        // ServeStaticModule.forRoot({
        //     rootPath: join(__dirname, '../public'),
        // }),
        ModulesModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
