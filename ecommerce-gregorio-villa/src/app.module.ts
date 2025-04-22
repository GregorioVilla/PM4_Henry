  import { Module } from '@nestjs/common';
  import { AppController } from './app.controller';
  import { AppService } from './app.service';
  import { ProductsModule } from './products/products.module';
  import { AuthModule } from './auth/auth.module';
  import { UsersModule } from './users/users.module';
  import { ConfigModule, ConfigService } from '@nestjs/config';
  import typeorm from './config/typeorm';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { OrdersModule } from './orders/orders.module';
  import { CategoriesModule } from './categories/categories.module';
import { FileuploadModule } from './fileupload/fileupload.module';
import { JwtModule } from '@nestjs/jwt';


  @Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [typeorm],
      }),
      TypeOrmModule.forRootAsync({
        inject: [ConfigService],
        useFactory:(config: ConfigService) => config.get('typeorm')!,
      }),
      JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRETS,
        signOptions: {expiresIn: "1h"}
      }),
      
      UsersModule,
      AuthModule,
      ProductsModule,
      CategoriesModule,
      OrdersModule,
      FileuploadModule,
    ],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule {}
