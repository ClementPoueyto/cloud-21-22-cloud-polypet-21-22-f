import {
  Injectable,
  Inject,
} from '@nestjs/common';
import { CollectionReference, DocumentData, Timestamp } from '@google-cloud/firestore';
import { PartnerDocument } from "./models/Partner.document";
import { ConfigService } from "@nestjs/config";
import { Partner } from "./dtos/Partner.dto";
import { PartnerProduct } from "./dtos/PartnerProduct.dto";
import { ProductPartnerDocument } from "./models/PartnerProduct.document";
import { StockDto } from "./dtos/stock.dto";
import { ProductDto } from "./dtos/product.dto";
import { PartnerProductsSoldDocument } from "./models/PartnerProductsSold.document";
import { ProductInformationsDto } from "./dtos/product-informations.dto";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, map } from 'rxjs';
@Injectable()
export class AppService {


  constructor(
    @Inject(PartnerDocument.collectionName)
    private partnersCollection: CollectionReference<PartnerDocument>,
    @Inject(ProductPartnerDocument.collectionName)
    private partnersProductsCollection: CollectionReference<ProductPartnerDocument>,
    @Inject(PartnerProductsSoldDocument.collectionName)
    private soldProductsCollection: CollectionReference<PartnerProductsSoldDocument>,
    @Inject(ConfigService)
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) { }
  readonly CATALOG_SERVICE_URL: string = "https://cloud-polypet-team-f.oa.r.appspot.com/catalog"


  getHello(): string {
    return 'Hello World Partner!';
  }


  async getAll(): Promise<PartnerDocument[]> {
    const snapshot = await this.partnersCollection.get();
    const partners: PartnerDocument[] = [];
    snapshot.forEach(doc => partners.push(doc.data()));
    return partners;
  }
  // get partners based on their status
  async getPartners(status: string) {
    const docs = await this.partnersCollection.where("status", "==", status).get();
    const partners: PartnerDocument[] = [];
    docs.forEach(doc => partners.push(doc.data()));

    if (status = "CONSIDERED") {
      docs.forEach(doc => {
        doc.ref.update("status", "IN_PROGRESS");
      })
    }
    return partners;

  }
  async getPartner(id: string) {
    const partner = await (await this.partnersCollection.doc(id).get()).data();
    return partner;
  }
  // get partners by type
  async getPartnersByType(type: string) {
    const docs = await this.partnersCollection.where("type", "==", type).get();
    const partners: PartnerDocument[] = [];
    docs.forEach(doc => partners.push(doc.data()));
    return partners;

  }

  //{id, name, password,type, status, creationDate }
  async addPartner(partner: Partner) {
    const docRef = this.partnersCollection.doc();
    const actualdate = Date.now();
    await docRef.set({
      creationDate: Timestamp.fromMillis(actualdate),
      password: partner.password,
      status: 'CONSIDERED',
      type: partner.type,
      name: partner.name,
    });

    return this.getId(partner.name)

  }

  async acceptPartner(name: string) {
    const docs = (await this.partnersCollection.where("name", "==", name).get())
    //.ref.update("status","ACCEPTED");

    docs.forEach(doc => {
      doc.ref.update("status", "ACCEPTED");
    })
  }

  async not_acceptPartner(name: string) {
    const docs = (await this.partnersCollection.where("name", "==", name).get())
    //.ref.update("status","ACCEPTED");

    docs.forEach(doc => {
      doc.ref.update("status", "NOT_ACCEPTED");
    })
  }


  async isAccepted(name: string): Promise<string> {

    /*    let partnerAcess: PartnerAcess
        partnerAcess= new PartnerAcess();
        partnerAcess.id="hhhh"
        partnerAcess.status="ACCEPTED"*/

    let res = 1;
    const returns: string[] = [];
    const ids: string[] = [];
    const partners: DocumentData[] = [];
    returns.push("you can't add a product yet , you should wait until you get accepted")
    returns.push("no partner with that name exist")
    const docs = (await this.partnersCollection.select("status").where("name", "==", name).get())
    // console.log(docs.empty)
    if (docs.empty == false) {
      //   console.log('hello')


      docs.forEach(doc => partners.push(doc.data()));
      //  console.log(partners[0])
      if (partners[0]["status"] == "ACCEPTED") {
        docs.forEach(doc => ids.push(doc.id));
        returns.push(ids[0])
        res = 2;
      }
      else
        res = 0;
    }
    return returns[res];

    //  return partnerAcess;
  }


  async addProduct(product: PartnerProduct) {
    const returns: string[] = [];
    returns.push("you can't add a product yet , you should wait until you get accepted")
    returns.push("no partner with that name exist")
    const is_accepted = await this.isAccepted(product.namePartner)
    if (is_accepted != returns[0] && is_accepted != returns[1]) {
      await this.partnersProductsCollection.doc()
        .set({
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          lables: product.lables,
          use_description: product.use_description,
          technical_description: product.technical_description,
          polypet_comission: 0.1,
          partnerId: is_accepted,
          status: "PENDING"
        })
      console.log("product" + await this.getProductId(product))
      return await this.getProductId(product);
    }
    console.log("can't create product" + is_accepted)
    return is_accepted
  }

  async validateProduct(ProductId: string) {
    const product = await this.partnersProductsCollection.doc(ProductId).get();
    const update_product = product.ref.update("status", "ON_MARKET");
    const product_updated = (await this.partnersProductsCollection.doc(ProductId).get()).data();
    console.log(JSON.stringify(product_updated))
    const infos = new ProductInformationsDto()
    infos.labels = product_updated.lables;
    infos.technicalDescription = product_updated.technical_description;
    infos.useDescription = product_updated.use_description;

    const validated_product = new ProductDto(ProductId, product_updated.name, product_updated.price, infos, product_updated.partnerId);
    const dtockdto = new StockDto(validated_product, product_updated.quantity)

    var url = "https://cloud-polypet-team-f.oa.r.appspot.com/catalog/"
    const id= await firstValueFrom(this.httpService.post(url, dtockdto).pipe(
      map(response => response.data)
    ))
    console.log(id)
    return id;
  }

  async AddSoldProduct(product: StockDto) {
    console.log("SOOLD!")
    console.log(JSON.stringify(product.product))
    if (product.product.seller) {
      const productPartner = await this.partnersProductsCollection.doc(product.product.idp_partner).get()
      const docRef = await this.soldProductsCollection.doc();
      console.log(JSON.stringify(productPartner.data()))
      //console.log(productPartner["polypet_comission"])
      const actualdate = Date.now();
      await docRef.set({
        soldOn: Timestamp.fromMillis(actualdate),
        partnerId: product.product.seller,
        productId: product.product.idp_partner,
        price: product.product.price * (1 - productPartner.data().polypet_comission)
      });
    }

  }

  async getSoldProducts(partnerId: string) {
    const docs = await this.soldProductsCollection.where("partnerId", "==", partnerId).get();
    const products: PartnerProductsSoldDocument[] = [];
    docs.forEach(doc => products.push(doc.data()));
    return products;
  }

  async SellProduct(products: StockDto[]) {
    products.forEach(product => this.AddSoldProduct(product))
  }

  async getId(name: string) {

    const docs = (await this.partnersCollection.where("name", "==", name).get())
    //.ref.update("status","ACCEPTED");
    const ids: string[] = []
    docs.forEach(doc => ids.push(doc.id)
    )
    return ids[0]
  }
  async getProductId(product: PartnerProduct) {
    const docs = (await this.partnersProductsCollection.where("name", "==", product.name).where("price", "==", product.price).where("use_description", "==", product.use_description).get())
    const ids: string[] = []
    docs.forEach(doc => ids.push(doc.id))

    return ids[0]
  }
}
