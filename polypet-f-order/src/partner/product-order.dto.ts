export class ProductOrderDto {
    name: string;
    seller:string
    quantity:number;

    
    constructor(object:any){
        this.name = object.name;
        this.seller = object.seller;
        this.quantity = object.quantity;
    }
}