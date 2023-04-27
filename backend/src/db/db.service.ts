import { Injectable, Logger } from '@nestjs/common'
import { MysqlError, OkPacket, Pool, PoolConnection } from 'mysql'

// eslint-disable-next-line
const mysql = require('mysql')

@Injectable()
export class DbService {
  private pool: Pool
  private readonly logger = new Logger(DbService.name)

  getPool(): Pool {
    if (!this.pool) {
      this.pool = mysql.createPool({
        host: process.env.MARIADB_HOST,
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASSWORD,
        database: process.env.MARIADB_DATABASE,
      })
    }

    return this.pool
  }

  async query(callback: CallableFunction) {
    await new Promise((resolve) =>
      this.getPool().getConnection(async (err, connection) => {
        if (err) throw err // not connected!
        await callback(connection)
        connection.release()
        resolve(1)
      }),
    )
  }

  async insert<T>(table: string, data: T): Promise<number> {
    return await new Promise(async (res, rej) =>
      this.query(async (conn: PoolConnection) => {
        if (0 == Object.keys(data).length) return 0

        const params = Object.keys(data).map((prop) => [prop, data[prop]])

        const stmt = `insert into \`${table}\` (${params
          .map((p) => p[0])
          .join(',')}) values (${new Array(params.length).fill('?').join(',')})`

        conn.query(
          stmt,
          params.map((p) => p[1]),
          (err: MysqlError, result: OkPacket) => {
            if (err) return rej(err)
            return res(result.insertId)
          },
        )
      }),
    )
  }

  async update<T>(
    table: string,
    id: number,
    data: Partial<T>,
  ): Promise<boolean> {
    return await new Promise(async (res, rej) =>
      this.query(async (conn: PoolConnection) => {
        if (0 == Object.keys(data).length) return res(true)

        const params = Object.keys(data).map((prop) => [prop, data[prop]])

        const stmt = `update \`${table}\` set ${params
          .map((p) => `\`${p[0]}\` = ?`)
          .join(',')} where \`id\` = ? limit 1`

        conn.query(
          stmt,
          [...params.map((p) => p[1]), id],
          (err: MysqlError, result: OkPacket) => {
            if (err) return rej(err)
            return res(result.affectedRows > 0)
          },
        )
      }),
    )
  }

  delete<T>(table: string, query: Partial<T>, limit = -1): Promise<number> {
    return new Promise((res, rej) =>
      this.query(async (conn: PoolConnection) => {
        const fields = [],
          exec = []

        for (const key in query) {
          fields.push(key)
          exec.push(query[key])
        }

        const stmt =
          `delete from \`${table}\` where ${fields
            .map((field) => `${field} = ?`)
            .join(' and ')}` +
          // empty query
          (fields.length == 0 ? '1=1' : '') +
          (limit > 0 ? ` limit ${limit}` : '')

        conn.query(stmt, exec, (err: MysqlError, result: OkPacket) => {
          if (err) return rej(err)
          return res(result.affectedRows)
        })
      }),
    )
  }

  find<T>(
    table: string,
    query: Partial<T>,
    limit = -1,
    searchMode = false,
  ): Promise<T[]> {
    return new Promise((res, rej) =>
      this.query(async (conn: PoolConnection) => {
        const fields = [],
          exec = []

        for (const key in query) {
          fields.push(key)
          exec.push(query[key])
        }

        const stmt =
          // construct query with column search
          `select * from \`${table}\` where ${fields
            .map((field) => (searchMode ? `${field} like ?` : `${field} = ?`))
            .join(searchMode ? ' or ' : ' and ')}` +
          // empty query
          (fields.length == 0 ? '1=1' : '') +
          // query limitation
          (limit > 0 ? ` limit ${limit}` : '')

        conn.query(stmt, exec, (err: MysqlError, result: T[]) => {
          if (err) return rej(err)
          return res(result)
        })
      }),
    )
  }

  async findOne<T>(table: string, query: Partial<T>): Promise<T> {
    const items = await this.find(table, query, 1)
    return items[0]
  }
}
