import { CatalogItemDto } from './catalog-item.dto';

export class CartDto {

    totalPrice: number;
    items: CatalogItemDto[];
}