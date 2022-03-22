import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { OrderContentDto } from './dto/order-content.dto';
import { OrderInfoDto } from './dto/order-info.dto';
import { PartnerService } from './partner/partner.service';

@Controller('order')
export class AppController {
  constructor(private readonly appService: AppService,private readonly partnerService: PartnerService) { }

  @Post()
  createOrder(@Body() orderDto: { informations: OrderInfoDto, cart: OrderContentDto }) {
   return this.appService.createOrder(orderDto);
  }

  @Get()
  getAllOrders() {
    return this.appService.getAllOrders();
  }

  @Get()
  getOrder(@Query('id') id: string) {
    return this.appService.getOrder(id);
  }

  @Get()
  getOrdersByState(@Query('state') state: "REGISTERED" | "IN PROCESS" | "PROCESSED") {
    return this.getOrdersByState(state);
  }

  @Get('dayli-order')
  getDayliOrder(@Query('day') day:Date){
    return this.appService.getOrderOfDay(day)
  }
  @Put()
  updateOrder(@Query('id') id: string, @Query('state') state: "REGISTERED" | "IN PROCESS" | "PROCESSED") {
    this.updateOrder(id, state);
  }

  @Get('partner-order')
  getPartnerOrder(@Query('partnerId') partnerId:string){
    return this.partnerService.getOrderProduct(partnerId)
  }
}
