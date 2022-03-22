
export class PartnerDto {
    name: string;
    password : string;
    type : string;

    constructor(object:any){
        this.name = object.name;
        this.password = object.password;
        this.type = object.type;
    }
}
