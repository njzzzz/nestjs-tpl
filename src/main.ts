import * as process from 'node:process'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const PORT = process.env.PORT || 3000
  // swagger
  const config = new DocumentBuilder()
    .setTitle('Nest Base Template')
    .setDescription('The Nest Base Template API Docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api_docs', app, document)
  // 参数校验
  app.useGlobalPipes(new ValidationPipe())
  // 安全
  app.use(helmet())
  await app.listen(PORT)
  // eslint-disable-next-line no-console
  console.log(`api docs locate at http://localhost:${PORT}/api_docs`)
}
bootstrap()
