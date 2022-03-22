import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ProductViewedDto } from './dto/product-viewed.dto';
import { SiteVisitedDto } from './dto/site-visited.dto';

@Controller('analytics')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('visit')
  postNewVisit(@Body() visit:SiteVisitedDto){
    return this.appService.postVisit(visit)
  }
  @Post('visit-product')
  postNewVisitProdut(@Body() visit:ProductViewedDto){
    return this.appService.postProductVisit(visit)
  }

  @Get('products-visit')
  getProductsVisit(@Query("day") day:Date){
    return this.appService.getProductSortByMostPopular(day)
  }

  @Get('products-sold')
  getProductsSoldAnalytics(@Query("day") day:Date){
    return this.appService.getProductPurchasedSortByMostPopular(day)
  }
  @Post('aggregate-dayli-order')
  aggregateDayliOrder(@Query('date')date:Date){
    if(date){
      date = new Date(date) 
      this.appService.aggregateOrder(date)
    }
    else
    {
      const currentDay = new Date(Date.now()) 
      const previousDay = new Date(currentDay.getFullYear(),currentDay.getMonth(),Number(currentDay.getDate())-1,4)
      this.appService.aggregateOrder(previousDay)
    }
  }

}
