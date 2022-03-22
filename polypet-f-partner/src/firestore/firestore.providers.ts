import {PartnerDocument} from "../models/Partner.document";
import {ProductPartnerDocument} from "../models/PartnerProduct.document";
import {PartnerProductsSoldDocument} from "../models/PartnerProductsSold.document";

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions'
export const FirestoreCollectionProviders: string[] = [
    PartnerDocument.collectionName,
    ProductPartnerDocument.collectionName,
    PartnerProductsSoldDocument.collectionName,
];
