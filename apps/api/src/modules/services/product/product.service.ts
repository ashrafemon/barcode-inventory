import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { ResponseTypes } from 'src/modules/dto/base.dto';
import {
    ProductQueryDto,
    ProductStoreDto,
    ProductStoreType,
    ProductUpdateDto,
} from 'src/modules/dto/product.dto';
import { HelperService } from 'src/modules/utils/helper/helper.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
    constructor(
        private readonly db: DatabaseService,
        private readonly helper: HelperService,
        private readonly category: CategoryService,
    ) {}

    async getDocs(queries: ProductQueryDto) {
        try {
            const condition: Record<string, any> = {};
            const { page, offset, skip, take } = this.helper.getPageOffset(
                queries.page,
                queries.offset,
            );
            const fields: Record<string, boolean | unknown> = Object.assign(
                { id: true, name: true, barcode: true, status: true },
                this.helper.getFieldRelations(
                    queries.fields,
                    queries['relations[]'],
                ),
            );

            if (queries.status) condition.status = queries.status;
            if (queries.category_id)
                condition.category_id = queries.category_id;
            if (queries.search) condition.name = { contains: queries.search };

            const orderKey = queries.order_field ?? 'created_at';
            const orderValue = queries.order_by ?? 'asc';

            if (queries.get_all) {
                const docs = await this.db.product.findMany({
                    where: condition,
                    select: fields,
                    orderBy: { [orderKey]: orderValue },
                });

                return this.helper.funcResponser({ data: docs });
            }

            const [count, docs] = await this.db.$transaction([
                this.db.product.count({ where: condition }),
                this.db.product.findMany({
                    select: fields,
                    where: condition,
                    skip: skip,
                    take: take,
                    orderBy: { [orderKey]: orderValue },
                }),
            ]);

            return this.helper.funcResponser({
                data: this.helper.paginate(count, docs, page, offset),
            });
        } catch (err) {
            return this.helper.funcResponser({
                type: ResponseTypes.SERVER_ERROR,
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                data: err,
            });
        }
    }

    async getDoc(id: string, queries: ProductQueryDto) {
        try {
            const fields: Record<string, boolean | unknown> = Object.assign(
                { id: true, name: true, barcode: true, status: true },
                this.helper.getFieldRelations(
                    queries.fields,
                    queries['relations[]'],
                ),
            );

            const idKey = queries.id_key ?? 'id';
            const condition: Record<string, any> = { [idKey]: id };

            const doc = await this.db.product.findFirst({
                where: condition,
                select: fields,
            });

            if (!doc) {
                return this.helper.funcResponser({
                    type: ResponseTypes.ERROR,
                    code: HttpStatus.NOT_FOUND,
                    message: 'Product not found.',
                });
            }

            return this.helper.funcResponser({ data: doc });
        } catch (err) {
            return this.helper.funcResponser({
                type: ResponseTypes.SERVER_ERROR,
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                data: err,
            });
        }
    }

    async createDoc(body: ProductStoreDto) {
        try {
            if (body.store_type === ProductStoreType.FETCH) {
                return this.addDocByFetch(body);
            }

            const exists = await this.db.product.count({
                where: { barcode: body.barcode },
            });
            if (exists) {
                return this.helper.funcResponser({
                    type: ResponseTypes.ERROR,
                    code: HttpStatus.BAD_REQUEST,
                    message: 'A product has already found with this barcode',
                });
            }

            const doc = await this.db.product.create({
                data: body,
            });
            return this.helper.funcResponser({
                data: doc,
                message: `Product added successfully`,
                code: HttpStatus.CREATED,
            });
        } catch (err) {
            return this.helper.funcResponser({
                type: ResponseTypes.SERVER_ERROR,
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                data: err,
            });
        }
    }

    async updateDoc(
        id: string,
        body: ProductUpdateDto,
        queries: ProductQueryDto,
    ) {
        try {
            const idKey = queries.id_key ?? 'id';
            const condition: Record<string, any> = { [idKey]: id };

            let doc = await this.db.product.findFirst({
                where: condition,
            });
            if (!doc) {
                return this.helper.funcResponser({
                    type: ResponseTypes.ERROR,
                    code: HttpStatus.NOT_FOUND,
                    message: 'Product not found...',
                });
            }

            const payload = { ...body };
            if ('id' in payload) delete payload['id'];

            doc = await this.db.product.update({
                where: { id: doc.id },
                data: payload,
            });
            return this.helper.funcResponser({
                data: doc,
                message: `Product updated successfully`,
            });
        } catch (err) {
            return this.helper.funcResponser({
                type: ResponseTypes.SERVER_ERROR,
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                data: err,
            });
        }
    }

    async deleteDoc(id: string, queries: ProductQueryDto) {
        try {
            const idKey = queries.id_key ?? 'id';
            const condition: Record<string, any> = { [idKey]: id };

            const doc = await this.db.product.findFirst({
                where: condition,
            });
            if (!doc) {
                return this.helper.funcResponser({
                    type: ResponseTypes.ERROR,
                    code: HttpStatus.NOT_FOUND,
                    message: 'Product not found...',
                });
            }

            await this.db.product.delete({ where: { id: doc.id } });
            return this.helper.funcResponser({
                data: doc,
                message: `Product deleted successfully`,
            });
        } catch (err) {
            return this.helper.funcResponser({
                type: ResponseTypes.SERVER_ERROR,
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                data: err,
            });
        }
    }

    async addDocByFetch(body: ProductStoreDto) {
        const getDocRes = await this.getDoc(body.barcode, {
            id_key: 'barcode',
        });
        if (getDocRes.ok) {
            return this.helper.funcResponser(getDocRes);
        }

        const fetchProductRes = await this.fetchProductByBarcode(body.barcode);
        if (!fetchProductRes.ok) {
            return this.helper.funcResponser(fetchProductRes);
        }

        const { name, barcode } = fetchProductRes.data as {
            name: string;
            barcode: string;
        };
        let product: Record<string, string | any> = {
            name,
            barcode,
            category_id: null,
        };

        const getCategoryRes = await this.category.getDoc('Uncategorized', {
            id_key: 'name',
        });
        if (getCategoryRes.ok) {
            const { id } = getCategoryRes.data as { id: string };
            product.category_id = id;
        } else {
            const createCategoryRes = await this.category.createDoc({
                name: 'Uncategorized',
                status: true,
            });
            if (!createCategoryRes.ok) {
                return this.helper.funcResponser(createCategoryRes);
            }
            const { id } = createCategoryRes.data as { id: string };
            product.category_id = id;
        }

        try {
            const doc = await this.db.product.create({
                data: {
                    name,
                    barcode,
                    ...(product.category_id && {
                        category_id: product.category_id,
                    }),
                },
                omit: { created_at: true, updated_at: true },
            });

            return this.helper.funcResponser({
                data: doc,
                message: 'Product added successfully',
                code: HttpStatus.CREATED,
            });
        } catch (err) {
            return this.helper.funcResponser({
                type: ResponseTypes.SERVER_ERROR,
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                data: err,
            });
        }
    }

    async fetchProductByBarcode(barcode: string) {
        try {
            const res = await fetch(
                `https://products-test-aci.onrender.com/product/${barcode}`,
            );
            if (!res.ok) {
                return this.helper.funcResponser({
                    type: ResponseTypes.ERROR,
                    code: HttpStatus.BAD_REQUEST,
                    message: 'Product not found with this barcode',
                });
            }

            const data = await res.json();
            if (!data.status || !data.product) {
                return this.helper.funcResponser({
                    type: ResponseTypes.ERROR,
                    code: HttpStatus.BAD_REQUEST,
                    message: 'Product not found with this barcode',
                });
            }

            const payload = {
                name: data.product.description,
                barcode: data.product.barcode,
            };

            return this.helper.funcResponser({ data: payload });
        } catch (err) {
            return this.helper.funcResponser({
                type: ResponseTypes.SERVER_ERROR,
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                data: err,
            });
        }
    }
}
