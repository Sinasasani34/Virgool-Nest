import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerConfigInit } from './config/swagger.config';
import * as cookieParser from "cookie-parser";
async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app);
  app.use(cookieParser(process.env.COOKIE_SECRET));
  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}: http://localhost:${port}`)
    console.log(`❤️ SwaWgger: http://localhost:${port}/swagger`)
  });
}
bootstrap();
