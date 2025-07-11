import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NotFoundFilter } from './modules/utils/filters/not-found.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
    });
    app.useGlobalFilters(new NotFoundFilter());

    const config = new DocumentBuilder()
        .setTitle('Barcode Inventory Management')
        .setVersion('1.0')
        .addTag('Api')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/request-docs', app, document);

    await app.listen(process.env.PORT ?? 5000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
