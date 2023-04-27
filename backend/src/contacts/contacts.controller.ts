import {
  Controller,
  Put,
  Patch,
  Delete,
  Get,
  Body,
  Param,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { ContactsService } from './contacts.service'
import { DbService } from './../db/db.service'
import { Contact } from 'src/types/Contact'
import { CrudResponse } from 'src/types/CrudResponse'

@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly dbService: DbService,
  ) {}

  @Put()
  async create(@Body() body: Partial<Contact>): Promise<CrudResponse> {
    const { name, email, phone }: Partial<Contact> = body

    if (!name || 0 == name.trim().length)
      return {
        success: false,
        error: 'Missing or invalid contact name.',
      }

    if (!email || !this.contactsService.isValidEmail(email))
      return {
        success: false,
        error: 'Missing or invalid contact email address.',
      }

    if (phone && !this.contactsService.isValidPhoneNumber(phone))
      return {
        success: false,
        error: 'Invalid contact phone number.',
      }

    if (await this.dbService.findOne<Contact>('contacts', { email }))
      return {
        success: false,
        error: 'A contact with this email already exists.',
      }

    const id = await this.dbService.insert<Contact>('contacts', {
      name: name.trim(),
      email,
      phone: phone?.trim(),
    })

    if (!(id > 0))
      return {
        success: false,
        error: 'Internal server error. Please try again later.',
      }

    return { success: true, id }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() body: Partial<Contact>,
  ): Promise<CrudResponse> {
    const { name, email, phone }: Partial<Contact> = body

    if (!name || 0 == name.trim().length)
      return {
        success: false,
        error: 'Missing or invalid contact name.',
      }

    if (!email || !this.contactsService.isValidEmail(email))
      return {
        success: false,
        error: 'Missing or invalid contact email address.',
      }

    if (phone && !this.contactsService.isValidPhoneNumber(phone))
      return {
        success: false,
        error: 'Invalid contact phone number.',
      }

    const contact = await this.dbService.findOne<Contact>('contacts', {
      id,
    })

    if (!contact?.id) throw new NotFoundException('Contact not found.')

    const existingWithEmail = await this.dbService.findOne<Contact>(
      'contacts',
      {
        email,
      },
    )

    if (existingWithEmail && existingWithEmail.id != id)
      return {
        success: false,
        error: 'A contact with this email already exists.',
      }

    const updated = await this.dbService.update<Contact>(
      'contacts',
      contact.id,
      {
        name: name.trim(),
        email,
        // optional field
        ...(phone !== undefined && { phone: phone?.trim() || null }),
      },
    )

    if (!updated)
      return {
        success: false,
        error: 'Internal server error. Please try again later.',
      }

    return { success: true, id }
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<CrudResponse> {
    if (!(+id > 0))
      throw new BadRequestException('Missing or invalid contact id.')

    const deleted = await this.dbService.delete<Contact>('contacts', { id }, 1)

    return { success: deleted > 0 }
  }

  @Get()
  async list(@Query('search') keyword: string): Promise<Contact[]> {
    let contacts: Contact[]

    if (keyword?.trim().length > 0) {
      contacts = await this.contactsService.search(keyword.trim())
    } else {
      contacts = await this.contactsService.list()
    }

    return contacts
  }
}
