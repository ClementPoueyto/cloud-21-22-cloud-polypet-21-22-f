import { CartItemDto } from "../dto/cart-item.dto";

export class CartDocument {
    static collectionName = 'cart';

    totalPrice: number;
    items: CartItemDto[];
}