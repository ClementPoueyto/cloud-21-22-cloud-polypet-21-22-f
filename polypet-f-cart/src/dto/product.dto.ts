export class ProductDto {
    id:string;
    name: string;
    price: number;
    seller: string;

    constructor(object:any){
        this.id=object.id
        this.name = object.name
        this.price = object.price
        this.seller = object.seller
    }
}
