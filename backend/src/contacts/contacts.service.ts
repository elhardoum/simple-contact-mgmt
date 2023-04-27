import { Injectable } from '@nestjs/common'
import { DbService } from './../db/db.service'
import { Contact } from 'src/types/Contact'

@Injectable()
export class ContactsService {
  private testMode: boolean

  constructor(private readonly dbService: DbService) {}

  // for testing purposes
  public setTestMode(mode: boolean) {
    this.testMode = mode
  }

  isValidEmail(email: string): boolean {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email,
    )
  }

  isValidPhoneNumber(phone: string): boolean {
    return /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone)
  }

  async list(): Promise<Contact[]> {
    return await this.dbService.find<Contact>(
      `contacts${this.testMode ? '__test' : ''}`,
      {},
    )
  }

  async search(keyword: string): Promise<Contact[]> {
    return await this.dbService.find<Contact>(
      `contacts${this.testMode ? '__test' : ''}`,
      {
        name: `%${keyword}%`,
        email: `%${keyword}%`,
        phone: `%${keyword}%`,
      },
      -1,
      true,
    )
  }
}
