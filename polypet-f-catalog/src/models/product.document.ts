import { DiscountDocument } from "./discount.document";
import { ProductInformationsDocument } from "./product-information.document";
export class ProductDocument {
    name: string;
    price: number;
    informations: ProductInformationsDocument;
    discount : DiscountDocument;
    seller: string;

    constructor(object:any){
        this.name = object.name
        this.price = object.price
        this.informations = object.informations
        this.discount = object.discount
        this.seller=object.seller
    }
}
