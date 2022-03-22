import { CartDto } from './cart.dto';
import { CartDocument } from "../models/cart.document";
import { CartValidationDto } from "./cart-validation.dto";

export class OrderDto {
    informations: CartValidationDto;
    cart : CartDocument;
}