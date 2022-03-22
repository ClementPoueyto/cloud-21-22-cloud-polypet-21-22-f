import { DiscountDto } from "./discount.dto";

export class CatalogItemDto {
    id: string;
    name: string;
    price: number;
    quantity: number;
    discount : DiscountDto
}