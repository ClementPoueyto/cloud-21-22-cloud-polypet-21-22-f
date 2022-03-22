import { ProductDayliSoldDocument } from "../models/product-dayli-sold.document";
import { ProductViewedHourlyDocument } from "../models/product-viewed-hourly.document";
import { SiteVisitHourlyDocument } from "../models/site-visit-hourly.document";
export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions'
export const FirestoreCollectionProviders: string[] = [
    ProductViewedHourlyDocument.collectionName,
    SiteVisitHourlyDocument.collectionName,
    ProductDayliSoldDocument.collectionName
];