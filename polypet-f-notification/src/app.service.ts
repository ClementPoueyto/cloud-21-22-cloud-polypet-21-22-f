import { Inject, Injectable } from '@nestjs/common';
import { OrderContentDto } from './dto/order-content.dto';
import { OrderDto } from './dto/order.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { StockDto } from './dto/stock.dto';
import { NotificationDocument } from './models/notification.document';
import { CollectionReference } from '@google-cloud/firestore';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class AppService {
  readonly CATALOG_SERVICE_URL: string = "https://cloud-polypet-team-f.oa.r.appspot.com/catalog"
 
  constructor(private httpService: HttpService, 
    @Inject(NotificationDocument.collectionName)
    private notificationCollection: CollectionReference<NotificationDocument>,) {
      }


  getHello(): string {
    return 'Hello World From Notification Service!';
  }
  async notifate(order: OrderDto): Promise<string> {
    let str = `${order.info.email} \n`;
    str += `Hello Mr/Mrs ${order.info.firstName},\n`;
    str += `Your order : ${order.id}, is ${order.state.toLocaleLowerCase()}.\n`;
    str += `It will be shipped to ${order.info.address}.\n\n`;
    str += await this.orderContent(order.content)
    let notifRef = this.notificationCollection.doc();
    await notifRef.set({clientEmail:order.info.email,notif:str});
    return notifRef.id;
  }

  async orderContent(order: OrderContentDto){
    let str = '';
    let ids = order.items.map(item => item.itemId);
    const response$ = this.httpService.get(this.CATALOG_SERVICE_URL+"/items?ids="+ids.join(',')).pipe(
      map(response => response.data)
    );
    const res:StockDto[] =await firstValueFrom(response$);
    res.forEach(item => {
      let price = item.product.price;
      if(item.product.discount !== undefined && item.product.discount.priceAfterReduction !== undefined) {price = item.product.discount.priceAfterReduction}
      str += `  ${item.product.name} ${price}$ x`+order.items.find(i => i.itemId === item.product.id)?.quantity+'\n';
    })
    str+= `Total price: ${order.totalPrice}$`
    return str;
  }

  async getNotification(email: string): Promise<string> {
    let queryRes = await this.notificationCollection.where('clientEmail','==',email).get();
    let notif: NotificationDto = undefined;
    queryRes.forEach(async notification =>{
      notif = new NotificationDto(notification.data())
      await this.notificationCollection.doc(notification.id).delete();
    })
    if(notif !== undefined)
      return notif.notif;
    return undefined;
  }
}
