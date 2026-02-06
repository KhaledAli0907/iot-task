import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as ngrok from '@ngrok/ngrok';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // Start ngrok tunnel
//   (async function () {
//     const listener = await ngrok.forward({
//       addr: port,
//       authtoken_from_env: true,
//     });
//     console.log(`NestJS application running on: ${await app.getUrl()}`);
//     console.log(`Public ngrok URL: ${listener.url()}`);
//   })();
}
bootstrap();
