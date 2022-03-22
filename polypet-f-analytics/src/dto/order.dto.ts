import { OrderContentDto } from "./order-content.dto";
import { OrderInfoDto } from "./order-info.dto";

export class OrderDto {
    id: string;
    info: OrderInfoDto;
    content: OrderContentDto;
    creationDate:Date;
    state: "REGISTERED" | "IN PROCESS" | "PROCESSED";
}