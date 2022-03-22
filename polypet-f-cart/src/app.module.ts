import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankModule } from './bank/bank.module';
import { FirestoreModule } from './firestore/firestore.module';

@Module({
  imports: [HttpModule, ConfigModule.forRoot({
    isGlobal: true,
  }), BankModule,
    FirestoreModule.forRoot({
      imports: [FirestoreModule, ConfigModule],
      useFactory: (configService: ConfigService) => ({

        keyFilename: configService.get<string>('SA_KEY'),
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
