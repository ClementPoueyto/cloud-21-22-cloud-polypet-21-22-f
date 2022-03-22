import { CartItemDto } from './dto/cart-item.dto';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CartValidationDto } from './dto/cart-validation.dto';

@Controller('cart')
export class AppController {
  constructor(private readonly appService: AppService) { }


  @Post('validation')
  validateCart(@Query('id') id: string, @Body() infos: CartValidationDto) {
    return this.appService.validateCart(id, infos);
  }

  @Post('update')
  updateItemsToCart(@Query('id') id: string, @Body() items: Array<CartItemDto>) {
    return this.appService.updateItemToCart(id, items);
  }

  @Get()
  getCart(@Query('id') id: string) {
    return this.appService.getCartByClientId(id);
  }

  @Get('items')
  getItemCatalogInCart(@Query('id') id: string) {
    return this.appService.getItemCatalogInCart(id);
  }

  @Get("itemsId")
  getIds(@Query("id") id:string)
  {return this.appService.getProductsById(id)}
}
