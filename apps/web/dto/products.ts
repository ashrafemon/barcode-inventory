import { CategoryDto } from "./categories";

export type ProductDto = {
    id: string;
    name: string;
    barcode: string;
    status: boolean;
    category: CategoryDto;
};
