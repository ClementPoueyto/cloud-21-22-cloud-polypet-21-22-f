import { DiscountDto } from './dto/discount.dto';
import { ProductDocument } from './models/product.document';
import { StockDto } from './dto/stock.dto';
import { CatalogItemDocument } from './models/catalog-item.document';
import { ProductDto } from './dto/product.dto';
import { HttpException, HttpStatus, Inject, Injectable, Query } from '@nestjs/common';
import { CollectionReference } from '@google-cloud/firestore';
import { ConfigService } from '@nestjs/config';
import { DiscountDocument } from './models/discount.document';

@Injectable()
export class AppService {

  constructor(@Inject(CatalogItemDocument.collectionName)
  private productCollection: CollectionReference<CatalogItemDocument>,
  @Inject(ConfigService)
  private configService: ConfigService){}

  createProduct(product: StockDto) {
    console.log(product.product)
    const id= this.productCollection.doc().id
    this.productCollection.doc(id).set( {item:product.product,quantity:product.quantity})
    return id;
  }

  async addStock(productId: string, quantity: number) {
    let docProduct = this.productCollection.doc(productId)
    let docRes = await docProduct.get();
    if(!docRes.data()){
      return false
    }
    let productUpdated =docRes.data()
    productUpdated.quantity= Number(quantity) + Number(productUpdated.quantity)
    if(productUpdated.quantity<0){
      productUpdated.quantity = 0;
    }
    docRes.ref.update(productUpdated)
    return productUpdated
  }

  async productPurchased(productPurchasedId:string, quantityPurchased: number){
    let docProduct = this.productCollection.doc(productPurchasedId)
    let docRes = await docProduct.get();
    if(!docRes.data()){
      return false
    }
    let productUpdated =docRes.data()
    if(productUpdated.quantity<quantityPurchased){
      return "Not enough product"
    }
    productUpdated.quantity= Number(productUpdated.quantity) - Number(quantityPurchased) 
    
    docRes.ref.update(productUpdated)
    return true
  }
  async updateProduct(productId:string, product: ProductDocument){
    let docProduct = this.productCollection.doc(productId)
    let docRes = await docProduct.get();
    if(!docRes.data()){
      return false
    }
    let productUpdated =docRes.data()
    productUpdated.item= product

    docRes.ref.update(productUpdated)
    return productUpdated
  }

  async addStocks(stocks:Array<any>){
    stocks.forEach(async (stock)=>{
      if(stock.id!=null&&stock.quantity)
        await this.addStock(stock.id, stock.quantity)
    })
  }
  async productCanBeAdded(productId: string, quantity: number) {
    let docProduct = this.productCollection.doc(productId)
    let docRes = await docProduct.get();
    if(!docRes.data()){//if product not exist can't be added to cart
      return false
    }
    let productQuantity =docRes.data().quantity;
    return productQuantity >= quantity;
  }

  async addDiscountProduct(id : string, discount : DiscountDto){
    if(discount.percentage==null&&discount.priceAfterReduction==null){
      throw new HttpException("pourcentage ou prix après réduction manquant", HttpStatus.BAD_REQUEST)
    }
    if(discount.end!=null){
      discount.end = new Date(discount.end)
    }
    if(discount.percentage<0||discount.percentage>100){
      throw new HttpException("pourcentage incorrecte : "+discount.percentage, HttpStatus.BAD_REQUEST)
    }
    const docProduct = await this.productCollection.doc(id).get();
    const catalogItem : CatalogItemDocument = docProduct.data();
    if(catalogItem!=null){
      if(discount.priceAfterReduction==null){
        if(discount.priceAfterReduction>=catalogItem.item.price){
          throw new HttpException("le prix initial : "+catalogItem.item.price+" est plus bad, réduction incrrecte : "+discount.priceAfterReduction, HttpStatus.BAD_REQUEST)
        }
        discount.priceAfterReduction=catalogItem.item.price-(catalogItem.item.price*discount.percentage/100)
      }
      if(discount.percentage==null){
        discount.percentage=100-(discount.priceAfterReduction*100/catalogItem.item.price)
      }
      catalogItem.item.discount = {percentage:discount.percentage, priceAfterReduction:discount.priceAfterReduction, end:discount.end}
      await docProduct.ref.update(catalogItem)
      return catalogItem;
    }
    else{
      throw new HttpException("Id de produit inconnu : "+id, HttpStatus.BAD_REQUEST)
    }
  }

  async getDiscountProducts(){
    let discountArray : Array<StockDto> = []
    const docProducts = await this.productCollection.where("item.discount","!=",null).get();
    docProducts.forEach((catalogItem)=>{
      let res = catalogItem.data();
      let productdto = new ProductDto(res.item)
      productdto.id = catalogItem.id
      discountArray.push(new StockDto(productdto, res.quantity))
    })
    return discountArray
  }

  getHello(): string {
    return 'Hello World Catalog!';
  }

  async getProductsByIds(ids : Array<string>){
    //initialise le tableau
    const products: StockDto[] = [];
    //pour chaque identifiant d'objet
    for(let i=0; i<ids.length; i++){
      const snapshot = await this.productCollection.doc(ids[i]).get();
      let prod = new StockDto(new ProductDto({}),0);
      //si l'objet existe
      if(snapshot.data()!=null){
        prod = new StockDto(new ProductDto(snapshot.data().item), snapshot.data().quantity);
        prod.product.id = ids[i];
      }
      else{
        prod.product= new ProductDto({id : ids[i]})
      }
      products.push(prod)
    }
    return products;
  }
  async getProductsByFilter(name: string, labels: string[]) {
    var query:any = this.productCollection;
    if(name != null && name != undefined){
      console.log("here")
      query = query.where('item.name', '==',name);
    }
    if(labels != null && labels != undefined && labels != []){
      console.log("here2")
      query = query.where('item.informations.labels', 'array-contains-any',labels);
    }
    var querySnapshot = await query.get();
    const products: ProductDto[] = [];
    querySnapshot.forEach((doc) => {
      let prod = new ProductDto(doc.data().item);
      prod.id = doc.id;
      products.push(prod)
    });
    return products;
  }

  async getProductsById(id: string) {
    const snapshot = await this.productCollection.doc(id).get();
    let prod = new ProductDto({});
    //si l'objet existe
    if(snapshot.data()!=null){
      prod = new ProductDto(snapshot.data().item);
    }  
    prod.id = id;
    return prod;

  }
}
