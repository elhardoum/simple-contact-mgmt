import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DbService } from './db/db.service'
import { ContactsModule } from './contacts/contacts.module'

@Module({
  imports: [
    // load environment variables from .env
    ConfigModule.forRoot(),
    // contacts module
    ContactsModule
  ],
  providers: [
    // inject the db service
    DbService,
  ],
  controllers: [],
})
export class AppModule {}
