import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { UsersModule } from './users/users.module';
import { RecordsModule } from './records/records.module';
import { TagsModule } from './tags/tags.module';
import { CreateUserDto } from './users/dto/create-user.dto';
import { CreateRecordDto } from './records/dto/create-record.dto';
import { CreateTagDto } from './tags/dto/create-tag.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Test Swagger')
  .setDescription('API test before implement it')
  .setVersion('1.0')
  .build();


const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
