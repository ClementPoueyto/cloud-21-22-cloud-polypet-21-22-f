import { OrderContentDto } from "src/dto/order-content.dto";
import { OrderInfoDto } from "src/dto/order-info.dto";

export class OrderDocument {
    static collectionName = 'order';

    info: OrderInfoDto;
    content: OrderContentDto;
    creationDate:Date
    state: "REGISTERED" | "IN PROCESS" | "PROCESSED";
}