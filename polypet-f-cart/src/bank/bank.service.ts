import { Injectable } from '@nestjs/common';
import { CartDocument } from '../models/cart.document';

@Injectable()
export class BankService {

    async verifyPaiment(creditCard: string, cart: CartDocument): Promise<boolean> {
        return true;
    }
}
