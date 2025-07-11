import { Module } from '@nestjs/common';
import { CategoryServiceModule } from '../category/category.module';
import { ProductService } from './product.service';

@Module({
    imports: [CategoryServiceModule],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductServiceModule {}
