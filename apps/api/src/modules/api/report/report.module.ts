import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
    imports: [JwtModule],
    providers: [ReportService],
    controllers: [ReportController],
})
export class ReportModule {}
