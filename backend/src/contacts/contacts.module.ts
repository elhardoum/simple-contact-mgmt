import { Module } from '@nestjs/common'
import { ContactsService } from './contacts.service'
import { ContactsController } from './contacts.controller'
import { DbService } from './../db/db.service'

@Module({
  providers: [ContactsService, DbService],
  controllers: [ContactsController],
})
export class ContactsModule {}
