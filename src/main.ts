import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomI18nValidationExceptionFilter } from '@common/infrastructure/exception-handler/custom-i18n-validation-exception.filter';
import { I18nMiddleware, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api');

  app.use(I18nMiddleware);
  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new CustomI18nValidationExceptionFilter());

  const PORT = process.env.PORT || 3001;

  await app.listen(PORT);
  console.log(`Server is running on http://localhost:${PORT}`);
}
bootstrap();
