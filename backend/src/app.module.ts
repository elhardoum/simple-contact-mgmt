import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DbService } from './db/db.service'

@Module({
  imports: [
    // load environment variables from .env
    ConfigModule.forRoot(),
  ],
  providers: [
    // inject the db service
    DbService,
  ],
  controllers: [],
})
export class AppModule {}
