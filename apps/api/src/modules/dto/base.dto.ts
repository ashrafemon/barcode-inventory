import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export enum ResponseTypes {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    VALIDATE_ERROR = 'VALIDATE_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
}

export enum OrderBy {
    ASC = 'asc',
    DESC = 'desc',
}

export type RequestWithAuth = Request & {
    auth: {
        id: string;
    };
};

export class DefaultDto {
    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    page?: number;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    offset?: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    user_id?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    id_key?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    fields?: string | string[];

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    relations?: string | string[];

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    'relations[]'?: string | string[];

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    get_all?: boolean;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    get_first?: boolean;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    order_field?: string;

    @ApiPropertyOptional({ enum: OrderBy })
    @IsEnum(OrderBy)
    @IsOptional()
    order_by?: OrderBy;
}
