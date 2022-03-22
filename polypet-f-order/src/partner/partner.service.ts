import { CollectionReference } from '@google-cloud/firestore';
import { Inject, Injectable } from '@nestjs/common';
import { ProductOrderDocument } from '../models/product-order.document';
import { ProductOrderDto } from './product-order.dto';

@Injectable()
export class PartnerService {
    constructor(
        @Inject(ProductOrderDocument.collectionName)
        private productOrderCollection: CollectionReference<ProductOrderDocument>
      ) { }
    async sendOrderProduct(partner: string,name: string, quantity: number): Promise<boolean> {
        await this.productOrderCollection.doc().set(
            {
                name: name,
                seller:partner,
                quantity:quantity
            }
        )
        console.log(partner+": order received \n "+name+" x"+quantity);
        return true;
    }

    async getOrderProduct(partner: string): Promise<string> {
        const queryRes = await this.productOrderCollection.where('seller', '==',partner).get()
        const productOrder= []
        let str = "Order:\n"
        queryRes.forEach(async product =>{
            productOrder.push(new ProductOrderDto(product.data()))
            str +=` ${product.data().name} x${product.data().quantity}`
            await this.productOrderCollection.doc(product.id).delete()
        })
        return str;
    }
}
