import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { FirestoreModule } from './firestore/firestore.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),HttpModule,
  FirestoreModule.forRoot({
    imports: [FirestoreModule, ConfigModule],
    useFactory: (configService: ConfigService) => ({

      keyFilename: configService.get<string>('SA_KEY'),
    }),
    inject: [ConfigService],
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
