import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { OrderDto } from './dto/order.dto';

@Controller('notification')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  notifate(@Body()order:OrderDto){
    return this.appService.notifate(order);
  }

  @Get('/:id')
  getNotif(@Param() param){
    return this.appService.getNotification(param.id);
  }
}
