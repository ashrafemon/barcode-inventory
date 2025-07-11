import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { ResponseTypes } from 'src/modules/dto/base.dto';
import {
    CategoryQueryDto,
    CategoryStoreDto,
    CategoryUpdateDto,
} from 'src/modules/dto/category.dto';
import { HelperService } from 'src/modules/utils/helper/helper.service';

@Injectable()
export class CategoryService {
    constructor(
        private readonly db: DatabaseService,
        private readonly helper: HelperService,
    ) {}

    async getDocs(queries: CategoryQueryDto) {
        try {
            const condition: Record<string, any> = {};
            const { page, offset, skip, take } = this.helper.getPageOffset(
                queries.page,
                queries.offset,
            );
            const fields: Record<string, boolean | unknown> = Object.assign(
                { id: true, name: true, status: true },
                this.helper.getFieldRelations(
                    queries.fields,
                    queries['relations[]'],
                ),
            );

            if (queries.status) condition.status = queries.status;
            if (queries.search) condition.name = { contains: queries.search };

            const orderKey = queries.order_field ?? 'created_at';
            const orderValue = queries.order_by ?? 'asc';

            if (queries.get_all) {
                const docs = await this.db.category.findMany({
                    where: condition,
                    select: fields,
                    orderBy: { [orderKey]: orderValue },
                });

                return this.helper.funcResponser({ data: docs });
            }

            const [count, docs] = await this.db.$transaction([
                this.db.category.count({ where: condition }),
                this.db.category.findMany({
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

    async getDoc(id: string, queries: CategoryQueryDto) {
        try {
            const fields: Record<string, boolean | unknown> = Object.assign(
                { id: true, name: true, status: true },
                this.helper.getFieldRelations(
                    queries.fields,
                    queries['relations[]'],
                ),
            );

            const idKey = queries.id_key ?? 'id';
            const condition: Record<string, any> = { [idKey]: id };

            const doc = await this.db.category.findFirst({
                where: condition,
                select: fields,
            });

            if (!doc) {
                return this.helper.funcResponser({
                    type: ResponseTypes.ERROR,
                    code: HttpStatus.NOT_FOUND,
                    message: 'Category not found.',
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

    async createDoc(body: CategoryStoreDto) {
        try {
            const doc = await this.db.category.create({
                data: body,
            });
            return this.helper.funcResponser({
                data: doc,
                message: `Category added successfully`,
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
        body: CategoryUpdateDto,
        queries: CategoryQueryDto,
    ) {
        try {
            const idKey = queries.id_key ?? 'id';
            const condition: Record<string, any> = { [idKey]: id };

            let doc = await this.db.category.findFirst({
                where: condition,
            });
            if (!doc) {
                return this.helper.funcResponser({
                    type: ResponseTypes.ERROR,
                    code: HttpStatus.NOT_FOUND,
                    message: 'Category not found...',
                });
            }

            const payload = { ...body };
            if ('id' in payload) delete payload['id'];

            doc = await this.db.category.update({
                where: { id: doc.id },
                data: payload,
            });
            return this.helper.funcResponser({
                data: doc,
                message: `Category updated successfully`,
            });
        } catch (err) {
            return this.helper.funcResponser({
                type: ResponseTypes.SERVER_ERROR,
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                data: err,
            });
        }
    }

    async deleteDoc(id: string, queries: CategoryQueryDto) {
        try {
            const idKey = queries.id_key ?? 'id';
            const condition: Record<string, any> = { [idKey]: id };

            const doc = await this.db.category.findFirst({
                where: condition,
            });
            if (!doc) {
                return this.helper.funcResponser({
                    type: ResponseTypes.ERROR,
                    code: HttpStatus.NOT_FOUND,
                    message: 'Category not found...',
                });
            }

            await this.db.category.delete({ where: { id: doc.id } });
            return this.helper.funcResponser({
                data: doc,
                message: `Category deleted successfully`,
            });
        } catch (err) {
            return this.helper.funcResponser({
                type: ResponseTypes.SERVER_ERROR,
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                data: err,
            });
        }
    }
}
