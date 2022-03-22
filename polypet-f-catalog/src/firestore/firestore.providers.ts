import { CatalogItemDocument } from "../models/catalog-item.document";

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions'
export const FirestoreCollectionProviders: string[] = [
    CatalogItemDocument.collectionName,
];