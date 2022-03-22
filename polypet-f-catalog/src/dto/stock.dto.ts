import { ProductDto } from './product.dto';

export class StockDto {
    product:ProductDto 
    quantity:number;

    constructor(product : ProductDto, quantity : number){
        this.product = product
        this.quantity = quantity
    }
}