import { ProductDocument } from './product.document';
export class CatalogItemDocument {
    static collectionName = 'catalog';
    item: ProductDocument;
    quantity:number;
}