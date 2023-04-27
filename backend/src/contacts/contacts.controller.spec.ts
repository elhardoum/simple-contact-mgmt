import { Test, TestingModule } from '@nestjs/testing'
import { ContactsController } from './contacts.controller'
import { ContactsService } from './contacts.service'
import { DbService } from './../db/db.service'

const dbServiceMock = {
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
}

const contactsServiceMock = {
  search: jest.fn(),
  list: jest.fn(),
}

class ContactsServiceMock extends ContactsService {
  search = contactsServiceMock.search
  list = contactsServiceMock.list
}

describe('ContactsController', () => {
  let controller: ContactsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        {
          provide: ContactsService,
          useClass: ContactsServiceMock,
        },
        {
          provide: DbService,
          useValue: dbServiceMock,
        },
      ],
    }).compile()

    controller = module.get<ContactsController>(ContactsController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should respond to create action', async () => {
    const res = await controller.create({
      name: 'test',
      email: 'test@test.test',
    })

    expect(dbServiceMock.insert).toHaveBeenCalled()
    expect(dbServiceMock.update).not.toHaveBeenCalled()
    expect(res.success).toStrictEqual(false)
  })

  it('should respond to update action', async () => {
    let error: string

    const res = await controller
      .update(42, {
        name: 'test',
        email: 'test@test.test',
      })
      .catch((err) => (error = err))

    expect(dbServiceMock.insert).not.toHaveBeenCalled()
    expect(dbServiceMock.findOne).toHaveBeenCalledWith('contacts', {
      id: 42,
    })

    expect(JSON.stringify(res)).toContain('NotFoundException')
    expect(error.toString()).toContain('NotFoundException')
  })

  it('should respond to delete action', async () => {
    const res = await controller.delete(42).catch(() => undefined)

    expect(dbServiceMock.find).not.toHaveBeenCalled()
    expect(dbServiceMock.delete).toHaveBeenCalledWith(
      'contacts',
      {
        id: 42,
      },
      1,
    )
    expect(res).toStrictEqual({ success: false })

    let error: string
    const res2 = await controller.delete(-42).catch((err) => (error = err))
    expect(JSON.stringify(error)).toContain('BadRequestException')
  })

  it('should respond to list action', async () => {
    await controller.list('')
    expect(contactsServiceMock.search).not.toHaveBeenCalled()
    expect(contactsServiceMock.list).toHaveBeenCalled()
    jest.clearAllMocks()
    await controller.list('search')
    expect(contactsServiceMock.search).toHaveBeenCalledWith('search')
    expect(contactsServiceMock.list).not.toHaveBeenCalled()
  })
})
