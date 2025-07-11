import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ReportModule } from './report/report.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [AuthModule, ProductModule, CategoryModule, ReportModule],
})
export class ApiModule {}
