import { Timestamp } from '@google-cloud/firestore';

export class PartnerProductsSoldDocument {
    static collectionName = 'partnersProductSold';
    productId: string;
    partnerId:string;
    soldOn: Timestamp;
    price : number;
}
