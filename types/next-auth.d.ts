import { type DefaultSession } from 'next-auth'
import '@auth/core/types'

declare module 'next-auth' {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      role?: string
    } & DefaultSession['user']
  }
}

declare module '@auth/core/types' {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      role?: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
  }
}
