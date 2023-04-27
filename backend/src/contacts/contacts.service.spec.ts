import { Test, TestingModule } from '@nestjs/testing'
import { ContactsService } from './contacts.service'
import { DbService } from './../db/db.service'

describe('ContactsService', () => {
  let service: ContactsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactsService, DbService],
    }).compile()

    service = module.get<ContactsService>(ContactsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should validate emails', () => {
    expect(service.isValidEmail('a@b.c')).toStrictEqual(false)
    expect(service.isValidEmail('a@b.cc')).toStrictEqual(true)
    expect(service.isValidEmail('abc@xyz')).toStrictEqual(false)
    expect(service.isValidEmail('abc xyz')).toStrictEqual(false)
    expect(service.isValidEmail('email@addr.es')).toStrictEqual(true)
    expect(service.isValidEmail('email@address.verylongltd')).toStrictEqual(
      true,
    )
  })

  it('should validate phone numbers', () => {
    expect(service.isValidPhoneNumber('abc')).toStrictEqual(false)
    expect(service.isValidPhoneNumber('1093')).toStrictEqual(false)
    expect(service.isValidPhoneNumber('587 222 3321')).toStrictEqual(true)
    expect(service.isValidPhoneNumber('+1 587 222 3321')).toStrictEqual(true)
    expect(service.isValidPhoneNumber('+1    587  222  3321')).toStrictEqual(
      false,
    )
    expect(service.isValidPhoneNumber('+1 587-222-3321')).toStrictEqual(true)
    expect(service.isValidPhoneNumber('+1 587-222')).toStrictEqual(false)
    expect(service.isValidPhoneNumber('+1 587-222-3321?')).toStrictEqual(false)
  })

  it('should list contacts', async () => {
    const contacts = await service.list()
    expect(contacts).toBeTruthy()
    // 2+ persisted from db test
    expect(contacts.length).toBeGreaterThan(1)
    expect(contacts[0].name).toBeDefined()
    expect(contacts[0].email).toBeDefined()
    expect(contacts[0].phone).toBeDefined()
    expect(contacts[0].id).toBeGreaterThan(0)
  })

  it('should search contacts', async () => {
    service.setTestMode(true)
    const contacts = await service.search('v2')
    expect(contacts).toBeTruthy()
    expect(contacts.length).toStrictEqual(1)
    const contacts2 = await service.search('Agent')
    expect(contacts2).toBeTruthy()
    expect(contacts2.length).toBeGreaterThan(1)
  })
})
