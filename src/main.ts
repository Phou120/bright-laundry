import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomI18nValidationExceptionFilter } from '@common/infrastructure/exception-handler/custom-i18n-validation-exception.filter';
import { I18nMiddleware, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors('*');
  app.setGlobalPrefix('api');

  app.use(I18nMiddleware);
  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new CustomI18nValidationExceptionFilter()); // FIX: Change fallback port from 300 to a standard port like 3000

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);
  console.log(`Server is running on http://localhost:${PORT}`);
}
bootstrap();
