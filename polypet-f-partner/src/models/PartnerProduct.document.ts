export class ProductPartnerDocument {
    static collectionName = 'partnersProducts';

    name: string;
    price: number;
    quantity : number;
    lables:string[];
    use_description:string;
    technical_description:string;
    polypet_comission : number;
    partnerId : string;
    status : string;

}
