import { Inject, Injectable } from '@nestjs/common';
import { SiteVisitedDto } from './dto/site-visited.dto';
import { CollectionReference } from '@google-cloud/firestore';
import { ProductViewedHourlyDocument } from './models/product-viewed-hourly.document';
import { ConfigService } from '@nestjs/config';
import { SiteVisitHourlyDocument } from './models/site-visit-hourly.document';
import { ProductViewedDto } from './dto/product-viewed.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { OrderDto } from './dto/order.dto'
import { ProductDayliSoldDocument } from './models/product-dayli-sold.document';
import { ProductDayliSoldDto } from './dto/product-dayli-sold.dto';
@Injectable()
export class AppService {

  readonly ORDERS_SERVICE_URL: string = "https://cloud-polypet-team-f.oa.r.appspot.com/order";

  constructor(@Inject(ProductViewedHourlyDocument.collectionName)
  private statProductViewedCollection: CollectionReference<ProductViewedHourlyDocument>,
    @Inject(SiteVisitHourlyDocument.collectionName)
    private statSitePassageCollection: CollectionReference<SiteVisitHourlyDocument>,
    @Inject(ProductDayliSoldDocument.collectionName)
    private productDayliSoldCollection: CollectionReference<ProductDayliSoldDocument>,
    @Inject(ConfigService)
    private configService: ConfigService,
    private readonly httpService: HttpService) { }

  async aggregateOrder(agregateDate: Date) {
    //delete data already added this date  to be idempotent
    const beginDay = new Date(agregateDate.getFullYear(), agregateDate.getMonth(), agregateDate.getDate(), 0);
    const endDay = new Date(agregateDate.getFullYear(), agregateDate.getMonth(), Number(agregateDate.getDate()) + 1, 0)
    console.log("service analytics ici"+beginDay+"-"+endDay)
    const aggregate = await this.productDayliSoldCollection.where('dayOfSold', ">=", beginDay).where('dayOfSold',"<",endDay).get()
    aggregate.forEach(async stat => {
      await this.productDayliSoldCollection.doc(stat.id).delete();
    })
    //aggregate data of order
    const salesToDate: OrderDto[] = await firstValueFrom(this.httpService.get(this.ORDERS_SERVICE_URL + "/dayli-order?day=" + agregateDate.toISOString()).pipe(
      map(response => response.data)
    ))
    const productSaleAnalytics: Map<string, ProductDayliSoldDto> = new Map<string, ProductDayliSoldDocument>()
    salesToDate.forEach(order => {
      order.content.items.forEach(product => {
        const productSaved = productSaleAnalytics.get(product.itemId)
        if (productSaved) {
          productSaved.nbProductSold += product.quantity
          productSaleAnalytics.set(productSaved.productId, productSaved)
        } else {
          const newProd = new ProductDayliSoldDto(product.itemId, agregateDate, product.quantity)
          productSaleAnalytics.set(newProd.productId, newProd)
        }
      })
    })
    productSaleAnalytics.forEach(async (value, key, map) => {
      await this.productDayliSoldCollection.doc().create({ productId: value.productId, dayOfSold: value.dayOfSold, nbProductSold: value.nbProductSold })
    })
  }

  getHello(): string {
    return 'Hello World Analytics!';
  }

  async postVisit(visit: SiteVisitedDto) {
    let visitDate = new Date(visit.timestamp)
    let hourOfVisit = new Date(visitDate.getFullYear(), visitDate.getMonth(), visitDate.getDay(), visitDate.getHours())
    let currentVisitHourRes = await this.statSitePassageCollection.where('visitingHour', '==', hourOfVisit).get();
    if (currentVisitHourRes.empty) {
      this.statSitePassageCollection.doc().create({ visitingHour: hourOfVisit, nbOfVisit: 1 })
      return 1
    }

    currentVisitHourRes.forEach(doc => {
      let visitHour = doc.data()
      visitHour.nbOfVisit += 1
      doc.ref.update(visitHour)
      return visitHour.nbOfVisit
    })
  }
  async postProductVisit(visit: ProductViewedDto) {
    const visitDate = new Date(visit.hourOfVisitProduct)
    const hourOfVisit = new Date(visitDate.getFullYear(), visitDate.getMonth(), visitDate.getDay(), visitDate.getHours())
    let currentVisitHourRes = await this.statProductViewedCollection.where('hourOfVisitProduct', '==', hourOfVisit).where('productId', '==', visit.productId).get();
    if (currentVisitHourRes.empty) {
      this.statProductViewedCollection.doc().create({ hourOfVisitProduct: hourOfVisit, productId: visit.productId, productPassage: 1 })
      return 1
    }

    currentVisitHourRes.forEach(doc => {
      let visitProdHour = doc.data()
      visitProdHour.productPassage += 1
      doc.ref.update(visitProdHour)
      return visitProdHour.productPassage
    })
  }
  async getProductSortByMostPopular(day: Date) {
    day = new Date(day)
    const beginDay = new Date(day.getFullYear(), day.getMonth(), day.getDate())
    const endDay = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59)
    console.log(beginDay + "" + endDay)
    let productOrderedByPopularityOfDay = await this.statProductViewedCollection
      .where('hourOfVisitProduct', '>', beginDay)
      .where('hourOfVisitProduct', '<', endDay).get()
    const mapProductIdInflux: Map<string, number> = new Map()
    productOrderedByPopularityOfDay.forEach(
      prod => {
        console.log(mapProductIdInflux[prod.data().productId])
        if (mapProductIdInflux.get(prod.data().productId)) {
          mapProductIdInflux.set(prod.data().productId, mapProductIdInflux.get(prod.data().productId) + prod.data().productPassage)
        } else {
          mapProductIdInflux.set(prod.data().productId, prod.data().productPassage)
        }
      }
    );
    const mapSort1 = [...mapProductIdInflux].sort((a, b) => b[1] - a[1]);
    return mapSort1;
  }
  async getProductPurchasedSortByMostPopular(day: Date) {
    day = new Date(day)
    const beginDay = new Date(day.getFullYear(), day.getMonth(), day.getDate())
    const endDay = new Date(day.getFullYear(), day.getMonth(), day.getDate()+1)
    console.log(beginDay + "" + endDay)
    let productOrderedByPopularityOfDay = await this.productDayliSoldCollection
      .where('dayOfSold', '>=', beginDay)
      .where('dayOfSold', '<', endDay).get()
    const mapProductIdInflux: Map<string, number> = new Map()
    productOrderedByPopularityOfDay.forEach(
      prod => {
        if (mapProductIdInflux.get(prod.data().productId)) {
          mapProductIdInflux.set(prod.data().productId, mapProductIdInflux.get(prod.data().productId) + prod.data().nbProductSold)
        } else {
          mapProductIdInflux.set(prod.data().productId, prod.data().nbProductSold)
        }
      }
    );
    const mapSort1 = [...mapProductIdInflux].sort((a, b) => b[1] - a[1]);
    return mapSort1;
  }
}
