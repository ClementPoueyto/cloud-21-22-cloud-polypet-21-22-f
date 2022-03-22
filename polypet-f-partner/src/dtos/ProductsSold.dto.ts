import {Timestamp} from "@google-cloud/firestore";

export class ProductSoldDto {
    soldOn: Timestamp;
    productId:string;
    partnerId:string;
    quantity:number;

}
