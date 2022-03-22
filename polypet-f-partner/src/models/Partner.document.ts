import { Timestamp } from '@google-cloud/firestore';

export class PartnerDocument {
    static collectionName = 'partners';

    name: string;
    password : string;
    type : string;
    status : string;
    creationDate: Timestamp;
}
