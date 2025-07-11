import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ReportService } from './report.service';

@Controller('api/reports')
@ApiTags('Reports')
@UseGuards(AuthGuard)
export class ReportController {
    constructor(private readonly service: ReportService) {}

    @Get('analytics')
    @HttpCode(HttpStatus.OK)
    analytics() {
        return this.service.analytics();
    }
}
