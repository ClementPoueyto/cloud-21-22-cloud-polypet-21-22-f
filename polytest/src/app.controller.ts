import { TodoDocument } from './documents/todo.document';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get()
  async getHello(): Promise<TodoDocument> {
    return await this.appService.create({name :"test"});
  }
  @Get('request')
  getRequestCart(){
    return this.appService.requestCart()
  }
}
