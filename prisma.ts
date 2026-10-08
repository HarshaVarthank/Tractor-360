import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL
  }

  // On Vercel (read-only file system), copy SQLite file to writable /tmp
  if (process.env.VERCEL) {
    const tmpDbPath = '/tmp/dev.db'
    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
        path.resolve('./prisma/dev.db'),
        path.resolve('./dev.db'),
      ]
      for (const src of candidates) {
        if (fs.existsSync(src)) {
          try {
            fs.copyFileSync(src, tmpDbPath)
            console.log(`Copied SQLite DB to ${tmpDbPath}`)
            break
          } catch (e) {
            console.error('Failed to copy SQLite to /tmp:', e)
          }
        }
      }
    }
    return `file:${tmpDbPath}`
  }

  return process.env.DATABASE_URL || 'file:./dev.db'
}

const resolvedDbUrl = getDatabaseUrl()
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = resolvedDbUrl
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedDbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
