import { NestFactory } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppModule } from "./application/app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ConfigModule.forRoot({isGlobal: true})
  // await app.init()
  const configService = app.get(ConfigService);
  const SERVER_PORT = parseInt(configService.get("SERVER_PORT")) || 3000;

  /**  Hot-reload. Relevant:
   *   - webpack-hmr.config.js
   *   - package.json scripts start:dev
   */
  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("CSide API")
    .setDescription("Booking service")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(SERVER_PORT);
}

bootstrap();
