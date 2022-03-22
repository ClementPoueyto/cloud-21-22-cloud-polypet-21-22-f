import {ProductInformationsDto} from "../dtos/product-informations.dto";
import {DiscountDto} from "../dtos/discount.dto";

export class ProductDto {
    id:string;
    idp_partner : string;
    name: string;
    price: number;
    informations: ProductInformationsDto;
    discount: DiscountDto;
    seller: string;

    constructor( id:string,name: string,price: number,informations: ProductInformationsDto,seller: string) {
        this.name = name
        this.price = price
        this.informations = informations
        this.seller = seller
        this.idp_partner=id;
    }
}
