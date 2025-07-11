import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProductServiceModule } from 'src/modules/services/product/product.module';
import { ProductController } from './product.controller';

@Module({
    imports: [JwtModule, ProductServiceModule],
    controllers: [ProductController],
})
export class ProductModule {}
