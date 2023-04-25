import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port: number = +process.env.HTTP_PORT || 3000

  await app.listen(port, null, () => console.log(`Listening on port ${port}`))
}

bootstrap()
