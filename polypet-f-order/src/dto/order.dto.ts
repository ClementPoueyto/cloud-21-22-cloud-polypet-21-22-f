import { OrderContentDto } from "./order-content.dto";
import { OrderInfoDto } from "./order-info.dto";

export class OrderDto {
    id: string;
    info: OrderInfoDto;
    content: OrderContentDto;
    creationDate:Date;
    state: "REGISTERED" | "IN PROCESS" | "PROCESSED";

    constructor(id,object:any){
        this.id = id;
        this.info = object.info
        this.content = object.content
        this.creationDate = object.creationDate
        this.state = object.state
    }
}