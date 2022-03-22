import { ProductOrderDocument } from "../models/product-order.document";
import { OrderDocument } from "../models/order.document";


export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions'
export const FirestoreCollectionProviders: string[] = [
    OrderDocument.collectionName,ProductOrderDocument.collectionName
];