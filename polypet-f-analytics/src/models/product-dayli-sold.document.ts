export class ProductDayliSoldDocument{
    static collectionName = 'productSales';
    productId:string;
    dayOfSold:Date;
    nbProductSold:number;
}