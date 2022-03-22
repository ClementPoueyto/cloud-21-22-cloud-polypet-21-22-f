import {Body, Controller, Get, Post, Put, Query} from '@nestjs/common';
import { AppService } from './app.service';
import {Partner} from "./dtos/Partner.dto";
import {PartnerProduct} from "./dtos/PartnerProduct.dto";
import {ProductDto} from "./dtos/product.dto";
import {StockDto} from "./dtos/stock.dto";

@Controller('partner')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('all')
  getAll()
  {
    return this.appService.getAll();
  }

  @Post('add')
  addPartner(@Body() partner: Partner)
  {
    return this.appService.addPartner(partner);
  }

  @Post('addProduct')
  addProduct(@Body() product:PartnerProduct)
  {
    return this.appService.addProduct(product);
  }

  @Get('status')
  getByStatus(@Query ('status') status: string)
  {
    return this.appService.getPartners(status);
  }

  @Get('type')
  getByType(@Query ('type') type: string)
  {
    return this.appService.getPartnersByType(type);
  }

  @Put('accept')
  acceptPartner(@Query('name') partner: string)
  {
    this.appService.acceptPartner(partner);
  }

  @Put('notAccept')
  notacceptPartner(@Query('name') partner: string)
  {
    this.appService.not_acceptPartner(partner);
  }

  @Get('isAccepted')
  isAccepted(@Query('name') partner: string)
  {
    return this.appService.isAccepted(partner);
  }

  @Put('validateProduct')
  validateProduct(@Query('ProductId') productId: string)
  {
    return this.appService.validateProduct(productId);
  }

  @Post('Sold')
  soldProduct(@Body() product:StockDto)
  {
    this.appService.AddSoldProduct(product);
  }

  @Get('sold')
  getSells(@Query('partnerId') partnerId: string)
  {
    return this.appService.getSoldProducts(partnerId);
  }
  @Get('partner-by-id')
  getPartner(@Query('id') id:string){
    return this.appService.getPartner(id)
  }

  @Get('getId')
  getIdPartner(@Query('name') partner: string)
  {
   return this.appService.getId(partner);
  }

}

