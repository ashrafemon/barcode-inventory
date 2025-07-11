import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithAuth, ResponseTypes } from 'src/modules/dto/base.dto';
import {
    ProductQueryDto,
    ProductStoreDto,
    ProductUpdateDto,
} from 'src/modules/dto/product.dto';
import { ProductService } from 'src/modules/services/product/product.service';
import { HelperService } from 'src/modules/utils/helper/helper.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/products')
@ApiTags('Products')
@UseGuards(AuthGuard)
export class ProductController {
    constructor(
        private readonly service: ProductService,
        private readonly helper: HelperService,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async index(
        @Query() queries: ProductQueryDto,
        @Req() req: RequestWithAuth,
    ) {
        const res = await this.service.getDocs({ ...queries });
        if (!res.ok && res.type === ResponseTypes.SERVER_ERROR) {
            return this.helper.serverException(res.data as Error);
        }
        if (!res.ok && res.type === ResponseTypes.ERROR) {
            return this.helper.exception(res.message, res.code);
        }
        return this.helper.entity(res.data, res.code, res.type, res.message);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async store(@Body() body: ProductStoreDto, @Req() req: RequestWithAuth) {
        const res = await this.service.createDoc(body);
        if (!res.ok && res.type === ResponseTypes.SERVER_ERROR) {
            return this.helper.serverException(res.data as Error);
        }
        if (!res.ok && res.type === ResponseTypes.ERROR) {
            return this.helper.exception(res.message, res.code);
        }
        return this.helper.entity(res.data, res.code, res.type, res.message);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async show(
        @Param('id') id: string,
        @Query() queries: ProductQueryDto,
        @Req() req: RequestWithAuth,
    ) {
        const res = await this.service.getDoc(id, { ...queries });
        if (!res.ok && res.type === ResponseTypes.SERVER_ERROR) {
            return this.helper.serverException(res.data as Error);
        }
        if (!res.ok && res.type === ResponseTypes.ERROR) {
            return this.helper.exception(res.message, res.code);
        }
        return this.helper.entity(res.data, res.code, res.type, res.message);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() body: ProductUpdateDto,
        @Req() req: RequestWithAuth,
    ) {
        const res = await this.service.updateDoc(id, body, {});
        if (!res.ok && res.type === ResponseTypes.SERVER_ERROR) {
            return this.helper.serverException(res.data as Error);
        }
        if (!res.ok && res.type === ResponseTypes.ERROR) {
            return this.helper.exception(res.message, res.code);
        }
        return this.helper.entity(res.data, res.code, res.type, res.message);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async destroy(@Param('id') id: string, @Req() req: RequestWithAuth) {
        const res = await this.service.deleteDoc(id, {});
        if (!res.ok && res.type === ResponseTypes.SERVER_ERROR) {
            return this.helper.serverException(res.data as Error);
        }
        if (!res.ok && res.type === ResponseTypes.ERROR) {
            return this.helper.exception(res.message, res.code);
        }
        return this.helper.entity(res.data, res.code, res.type, res.message);
    }
}
