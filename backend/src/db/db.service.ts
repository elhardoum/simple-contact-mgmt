import { Injectable, Logger } from '@nestjs/common'
import { Pool, PoolConnection } from 'mysql'

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

  async insert<T>(
    table: string,
    data: T,
  ): Promise<boolean | number> {
    return await new Promise(async (res, rej) =>
      this.query(async (conn: PoolConnection) => {
        if (0 == Object.keys(data).length) return false

        let stmt = `insert into \`${table}\` set `
        const params = []

        for (const prop in data) {
          params.push(data[prop])
          stmt += `\`${prop}\` = ?, `
        }

        stmt = stmt.replace(/\, $/, '')

        conn.query(stmt, params, (err, result) => {
          if (err) return rej(err)
          return res(result.insertId)
        })
      }),
    )
  }

  // @todo fix any type return
  async update<T>(
    table: string,
    id: number,
    data: Partial<T>,
  ): Promise<any> {
    return await new Promise(async (res, rej) =>
      this.query(async (conn) => {
        if (0 == Object.keys(data).length) return res(true)

        let stmt = `update \`${table}\` set `
        const params = []

        for (const prop in data) {
          params.push(data[prop])
          stmt += `\`${prop}\` = ?, `
        }

        stmt = stmt.replace(/\, $/, '')
        stmt += ` where \`id\` = ? limit 1`

        conn.query(stmt, [...params, id], (err, result) => {
          if (err) return rej(err)
          return res(result)
        })
      }),
    )
  }

  delete<T>(table: string, query: Partial<T>, limit = -1): Promise<number> {
    return new Promise((res, rej) =>
      this.query(async (conn) => {
        const fields = [],
          exec = []

        for (const key in query) {
          fields.push(key)
          exec.push(query[key])
        }

        const stmt =
          `delete from \`${table}\` where ${fields
            .map((field) => `${field} = ?`)
            .join(' and ')}` + (limit > 0 ? ` limit ${limit}` : '')

        conn.query(stmt, exec, (err, result) => {
          if (err) return rej(err)
          return res(result.affectedRows)
        })
      }),
    )
  }

  find<T>(table: string, query: Partial<T>, limit = -1): Promise<T[]> {
    return new Promise((res, rej) =>
      this.query(async (conn) => {
        const fields = [],
          exec = []

        for (const key in query) {
          fields.push(key)
          exec.push(query[key])
        }

        const stmt =
          `select * from \`${table}\` where ${fields
            .map((field) => `${field} = ?`)
            .join(' and ')}` + (limit > 0 ? ` limit ${limit}` : '')

        conn.query(stmt, exec, (err, result) => {
          if (err) return rej(err)
          return res(result as T[])
        })
      }),
    )
  }

  async findOne<T>(table: string, query: Partial<T>): Promise<T> {
    const items = await this.find(table, query, 1)
    return items[0]
  }
}
