import { ProductDto } from "./products";

export type CategoryDto = {
    id: string;
    name: string;
    status: boolean;
    products: ProductDto[];
};

export type CategoryFormDto = {
    name: string;
};

export interface CategoryProductKanbanCard {
    id: string;
    name: string;
    barcode: string;
}
