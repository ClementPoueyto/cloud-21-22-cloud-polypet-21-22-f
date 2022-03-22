import { CartItemDto } from "./cart-item.dto";

export class OrderContentDto {
    totalPrice: number;
    items: CartItemDto[];
}