import { Inject, Injectable } from '@nestjs/common';
import { OrderContentDto } from './dto/order-content.dto';
import { OrderInfoDto } from './dto/order-info.dto';
import { OrderDocument } from './models/order.document';
import { CollectionReference } from '@google-cloud/firestore';
import { OrderDto } from './dto/order.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { StockDto } from './dto/stock.dto';
import { PartnerService } from './partner/partner.service';
import { response } from 'express';
import { PartnerDto } from './dto/Partner.dto';

@Injectable()
export class AppService {
  readonly NOTIFICATION_SERVICE_URL: string = "https://cloud-polypet-team-f.oa.r.appspot.com/notification"
  readonly CATALOG_SERVICE_URL: string = "https://cloud-polypet-team-f.oa.r.appspot.com/catalog"
  readonly PARTNER_SERVICE_URL: string = "https://cloud-polypet-team-f.oa.r.appspot.com/partner"

  constructor(
    @Inject(PartnerService)
    private partnerApi: PartnerService,
    @Inject(OrderDocument.collectionName)
    private orderCollection: CollectionReference<OrderDocument>,private httpService: HttpService
  ) { }

  async createOrder(orderDto: { informations: OrderInfoDto, cart: OrderContentDto }) {
    let orderRef = this.orderCollection.doc();
    await orderRef.set({ info: orderDto.informations, content: orderDto.cart, state: "REGISTERED", creationDate: new Date(Date.now()) });
    let orderDto2 = new OrderDto(orderRef.id,{ info: orderDto.informations, content: orderDto.cart, state: "REGISTERED", creationDate: new Date(Date.now()) })
    const response$ = await firstValueFrom(this.httpService.post(this.NOTIFICATION_SERVICE_URL,orderDto2));
    this.sendMessageToPartner(orderDto2.content);
    return orderRef.id;
  }
  async sendMessageToPartner(order: OrderContentDto){
    let ids = order.items.map(item => item.itemId);
    const response$ = this.httpService.get(this.CATALOG_SERVICE_URL+"/items?ids="+ids.join(',')).pipe(
      map(response => response.data)
    );
    const res:StockDto[] =await firstValueFrom(response$);
    res.forEach(async item => {
      if(item.product.seller !== null && item.product.seller !== undefined) {
        const response2$ = this.httpService.get(this.PARTNER_SERVICE_URL+"/partner-by-id?id="+item.product.seller).pipe(
          map(response => response.data)
        );
        const partner:PartnerDto =await firstValueFrom(response2$);
        if(partner.type === "BIG")
          this.partnerApi.sendOrderProduct(item.product.seller,item.product.name,order.items.find(i => i.itemId === item.product.id)?.quantity)
      }
    })
  }
  
  async getAllOrders() {
    const snapshot = await this.orderCollection.get();
    const orders: OrderDto[] = [];
    snapshot.forEach(order => orders.push(new OrderDto(order.id,order.data())));
    return orders;
  }

  async getOrder(id: string) {
    const snapshot = await this.orderCollection.doc(id).get();
    if (snapshot.data() != null)
      return new OrderDto(snapshot.id,snapshot.data())
  }

  async getOrdersByState(state: "REGISTERED" | "IN PROCESS" | "PROCESSED") {
    const snapshot = await this.orderCollection.get();
    const orders: OrderDto[] = [];
    snapshot.forEach(order => {
      if (order.data().state === state)
        orders.push(new OrderDto(order.id,order.data()));
    });
    return orders;
  }

  async updateOrder(id: string, state: "REGISTERED" | "IN PROCESS" | "PROCESSED") {
    const snapshot = await this.orderCollection.doc(id).get();
    if (snapshot.data() != null) {
      let orderUpdated = snapshot.data();
      orderUpdated.state = state;
      snapshot.ref.update(orderUpdated);
      return new OrderDto(snapshot.id,orderUpdated);
    }
  }

  async getOrderOfDay(day: Date) {
    day =  new Date(day);
    const beginDay = new Date(day.getFullYear(),day.getMonth(),day.getDate(),1);
    const endDay = new Date(day.getFullYear(),day.getMonth(),Number(day.getDate())+1,1)
    const queryRes =await this.orderCollection.where('creationDate','>=',beginDay).where('creationDate',"<",endDay).get()
    const dayOrder= []
    queryRes.forEach(order =>{
      dayOrder.push(new OrderDto(order.id,order.data()))
    })
    return dayOrder
  }

}
