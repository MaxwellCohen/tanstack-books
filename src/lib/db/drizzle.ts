import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

type Sql = NeonQueryFunction<false, false>
type Database = ReturnType<typeof drizzle>

let sql: Sql | null = null
let db: Database | null = null
let boundUrl: string | undefined

function connectionString() {
  return typeof process !== 'undefined' ? process.env.POSTGRES_URL : undefined
}

export function getSql() {
  const url = connectionString()
  if (!url) return null
  if (!sql || boundUrl !== url) {
    sql = neon(url)
    db = null
    boundUrl = url
  }
  return sql
}

export function getDb() {
  const client = getSql()
  if (!client) return null
  if (!db) db = drizzle(client)
  return db
}

export function requireSql() {
  const client = getSql()
  if (!client) throw new Error('POSTGRES_URL environment variable is not set')
  return client
}

export function requireDb() {
  const database = getDb()
  if (!database) throw new Error('POSTGRES_URL environment variable is not set')
  return database
}
