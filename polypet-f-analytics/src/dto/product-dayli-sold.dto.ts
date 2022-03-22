export class ProductDayliSoldDto{
    productId:string;
    dayOfSold:Date;
    nbProductSold:number;
    constructor(productId:string,dayOfSold:Date,nbProductSold:number){
        this.productId=productId;
        this.dayOfSold= dayOfSold;
        this.nbProductSold=nbProductSold;
    }
}