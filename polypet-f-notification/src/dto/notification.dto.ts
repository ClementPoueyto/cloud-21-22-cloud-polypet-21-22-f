
export class NotificationDto {
    static collectionName = 'notification';

    clientEmail: string;
    notif: string;

    constructor(object:any){
        this.clientEmail = object.clientEmail;
        this.notif = object.notif;
    }
}