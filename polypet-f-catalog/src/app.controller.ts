import { DiscountDto } from './dto/discount.dto';
import { ProductDocument } from './models/product.document';
import { StockDto } from './dto/stock.dto';
import { Body, Controller, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';


@Controller('catalog')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  addNewProduct(@Body() product : StockDto){
    return this.appService.createProduct(product)
  }
  
  @Put('add-to-stock')
  addStockForProduct(@Query('id') productId:string,@Query('quantity')quantity:number){
    return this.appService.addStock(productId,quantity)
  }

  @Put('add-to-stocks')
  addStockForProducts(@Body() products:Array<any>){
    return this.appService.addStocks(products)
  }

  @Put('product-purchased')
  productPurchased(@Query('id') productId:string,@Query('quantity')quantity:number)
  {
    return this.appService.productPurchased(productId,quantity)
  }

  @Put('update-product')
  updateProduct(@Query('id') productId,@Body() product:ProductDocument){
    return this.appService.updateProduct(productId,product)
  }

  @Put('discount')
  addDiscountProduct(@Query('id') productId,@Body() discount:DiscountDto){
    return this.appService.addDiscountProduct(productId, discount)
  }

  @Get('discount')
  getDiscountProduct(){
    return this.appService.getDiscountProducts()
  }

  @Get('can-be-added')
  productCanBeAdded(@Query('id') productId:string,@Query('quantity') quantity:number){
    return this.appService.productCanBeAdded(productId,quantity)
  }

  @Get('items')
  getItemsByIds(  @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
  ids: string[],){
    return this.appService.getProductsByIds(ids)
  }

  @Get('item/:id')
  getItem( @Param() param){
    return this.appService.getProductsById(param.id)
  }

  @Get('itemsFilters')
  getProductsByLabels(@Query('name') name:string,@Query('labels', new ParseArrayPipe({ items: String, separator: ',', optional: true }))
  labels: string[] ){
    console.log(name)
    console.log(labels)

    return this.appService.getProductsByFilter(name,labels);
  }

}
