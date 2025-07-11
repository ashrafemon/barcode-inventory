import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateIf,
} from 'class-validator';
import { DefaultDto } from './base.dto';

export enum ProductStoreType {
    ENTRY = 'ENTRY',
    FETCH = 'FETCH',
}

export class ProductQueryDto extends DefaultDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    category_id?: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    status?: boolean;
}

export class ProductStoreDto {
    @ApiProperty({ enum: ProductStoreType })
    @IsEnum(ProductStoreType)
    store_type: ProductStoreType;

    @ApiPropertyOptional()
    @ValidateIf((o) => o.store_type === ProductStoreType.ENTRY)
    @IsString()
    @IsOptional()
    category_id: string;

    @ApiProperty()
    @ValidateIf((o) => o.store_type === ProductStoreType.ENTRY)
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @ValidateIf(
        (o) =>
            o.store_type === ProductStoreType.ENTRY ||
            o.store_type === ProductStoreType.FETCH,
    )
    @IsString()
    @IsNotEmpty()
    barcode: string;

    @ApiPropertyOptional()
    @ValidateIf((o) => o.store_type === ProductStoreType.ENTRY)
    @IsBoolean()
    @IsOptional()
    status: boolean;
}

export class ProductUpdateDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    category_id: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    barcode: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    status: boolean;
}
