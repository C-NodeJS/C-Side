import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { TypeOrmModule } from "@nestjs/typeorm/dist/typeorm.module";
import { UserModel } from "../infrastructure/data-access/typeorm/user.entity";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        user_name: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: [`${__dirname}/../**/*.entities.js`],
        synchronize: true
      })
    }),
    UserModule, //TODO add more module to DI...
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
