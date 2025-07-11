import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { HelperService } from 'src/modules/utils/helper/helper.service';

@Injectable()
export class ReportService {
    constructor(
        private readonly db: DatabaseService,
        private readonly helper: HelperService,
    ) {}

    async analytics() {
        try {
            const [categories, products] = await this.db.$transaction([
                this.db.category.findMany({
                    select: {
                        name: true,
                        _count: {
                            select: { products: { where: { status: true } } },
                        },
                    },
                    orderBy: {
                        name: 'asc',
                    },
                }),
                this.db.product.findMany({
                    select: {
                        name: true,
                        barcode: true,
                        category: { select: { name: true } },
                    },
                    take: 10,
                    orderBy: {
                        created_at: 'desc',
                    },
                }),
            ]);

            const formatCategories = categories.map((item) => ({
                name: item.name,
                product_count: item._count.products,
            }));

            return this.helper.entity({
                categories: formatCategories,
                recent_products: products,
            });
        } catch (err) {
            return this.helper.serverException(err);
        }
    }
}
