import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DefaultDto } from './base.dto';

export class CategoryQueryDto extends DefaultDto {
    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    status?: boolean;
}

export class CategoryStoreDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    status: boolean;
}

export class CategoryUpdateDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    status: boolean;
}
