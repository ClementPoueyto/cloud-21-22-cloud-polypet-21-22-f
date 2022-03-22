import { ProductInformationsDto } from "./product-informations.dto";
import { DiscountDto } from './discount.dto';
export class ProductDto {
    id:string;
    idp_partner:string;
    name: string;
    price: number;
    informations: ProductInformationsDto;
    description:string;
    type:string;
    discount : DiscountDto;
    seller: string;

    constructor(object:any){
        this.id=object.id
        this.idp_partner=object.idp_partner
        this.name = object.name
        this.price = object.price
        this.informations = object.informations
        this.description = object.description
        this.type = object.type
        this.discount =object.discount
        this.seller = object.seller
    }
}
