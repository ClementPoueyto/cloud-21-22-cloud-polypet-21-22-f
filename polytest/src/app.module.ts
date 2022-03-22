import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirestoreModule } from './firestore/firestore.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  
  FirestoreModule.forRoot({
    imports: [FirestoreModule ,ConfigModule],
    useFactory: (configService: ConfigService) => ({
      
      keyFilename: configService.get<string>('SA_KEY'),
    }),
    inject: [ConfigService],
  }),
  HttpModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
