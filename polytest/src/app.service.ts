import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  Inject,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { CollectionReference, Timestamp } from '@google-cloud/firestore';
import { TodoDocument } from './documents/todo.document';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class AppService {
  
  cartUrl = "https://polypet-f-catalog-dot-cloud-polypet-team-f.oa.r.appspot.com/cart"
  async requestCart() {
    const response$ = this.httpService.get(this.cartUrl).pipe(
      map(response => response.data)
    )
    const cartHello = await firstValueFrom(response$);
    return cartHello
  }
  

  private logger: Logger = new Logger(TodoDocument.name);

  constructor(
    @Inject(TodoDocument.collectionName)
    private todosCollection: CollectionReference<TodoDocument>,
    @Inject(ConfigService)
    private configService : ConfigService,
    private readonly httpService:HttpService

  ) {
    console.log(configService.get<string>('SA_KEY'))
  }

  getHello(): string {
    return 'Hello World!';
  }

  async create({ name }): Promise<TodoDocument> {
    const docRef = this.todosCollection.doc(name);
    const dueDateMillis = new Date();
    await docRef.set({
      name,
      dueDate: Timestamp.fromMillis(dueDateMillis.getTime()),
    });
    const todoDoc = await docRef.get();
    const todo = todoDoc.data();
    return todo;
  }

  async findAll(): Promise<TodoDocument[]> {
    const snapshot = await this.todosCollection.get();
    const todos: TodoDocument[] = [];
    snapshot.forEach(doc => todos.push(doc.data()));
    return todos;
  }
}