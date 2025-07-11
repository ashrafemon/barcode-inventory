import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CategoryServiceModule } from 'src/modules/services/category/category.module';
import { CategoryController } from './category.controller';

@Module({
    imports: [JwtModule, CategoryServiceModule],
    controllers: [CategoryController],
})
export class CategoryModule {}
