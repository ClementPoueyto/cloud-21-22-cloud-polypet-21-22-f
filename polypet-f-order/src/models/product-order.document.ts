import { OrderContentDto } from "src/dto/order-content.dto";
import { OrderInfoDto } from "src/dto/order-info.dto";

export class ProductOrderDocument {
    static collectionName = 'product-order';

    name: string;
    seller:string
    quantity:number;

}