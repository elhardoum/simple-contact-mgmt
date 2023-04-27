import { Test, TestingModule } from '@nestjs/testing'
import { DbService } from './db.service'
import { MysqlError, PoolConnection } from 'mysql'
import { Contact } from 'src/types/Contact'

describe('DbService', () => {
  let service: DbService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbService],
    }).compile()

    service = module.get<DbService>(DbService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should get the connections pool', () => {
    expect(service.getPool).toBeDefined()
    expect(service.getPool().getConnection).toBeDefined()
  })

  it('should query the table', async () => {
    await service.query(async (conn: PoolConnection) => {
      const result = await new Promise<any[]>((resolve, reject) =>
        conn.query('select 1', (error: MysqlError, result: any[]) =>
          error ? reject(error) : resolve(result),
        ),
      )

      expect(result.length).toBe(1)
      expect(JSON.stringify(result[0])).toStrictEqual('{"1":1}')
    })
  })

  it('should delete any pre-existing test data (and test deletes)', async () => {
    // delete all contacts
    await service.delete<Contact>('contacts__test', {})
    const contacts = await service.find<Contact>('contacts__test', {})
    expect(contacts).toStrictEqual([])
  })

  it('should test inserts', async () => {
    expect(service.insert).toBeDefined()

    const contact = {
      name: 'Jest Agent',
      email: `Jest@${+new Date()}.com`,
    }

    const insertId = await service.insert<Contact>('contacts__test', contact)
    expect(insertId).toBeGreaterThan(0)

    const contact2 = {
      name: 'Jest Agent',
      email: `Jest@${+new Date()}.com`,
    }

    await service.insert<Contact>('contacts__test', contact2)
    const contacts = await service.find<Contact>('contacts__test', {})
    expect(contacts.length).toStrictEqual(2)
  })

  it('should test updates', async () => {
    const contact = await service.findOne<Contact>('contacts__test', {})
    expect(contact).toBeTruthy()
    expect(contact.id).toBeGreaterThan(0)

    const update = await service.update<Contact>('contacts__test', contact.id, {
      name: 'Jest Agent v2',
    })

    expect(update).toBeTruthy()
    const contactNew = await service.findOne<Contact>('contacts__test', {
      id: contact.id,
    })
    expect(contactNew).toBeTruthy()
    expect(contactNew.id).toStrictEqual(contact.id)
    expect(contactNew.name).toStrictEqual('Jest Agent v2')
  })

  it('should test find/findOne method', async () => {
    const contacts = await service.find<Contact>('contacts__test', {})
    expect(contacts.length).toStrictEqual(2)

    const contactsWithQuery = await service.find<Contact>(
      'contacts__test',
      {
        name: '%v2%',
      },
      -1,
      true,
    )

    expect(contactsWithQuery.length).toStrictEqual(1)

    const contact = await service.findOne<Contact>('contacts__test', {
      id: contacts[0].id,
    })

    expect(contact).toBeTruthy()
    expect(contact.id).toStrictEqual(contacts[0].id)
    expect(contact.name).toBeDefined()
    expect(contact.email).toBeDefined()
    expect(contact.phone).toBeDefined()
  })
})
