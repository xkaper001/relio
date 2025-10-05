import 'next-auth'
import 'next-auth/adapters'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }

  interface User {
    username: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    username?: string
    email?: string
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser {
    username: string
  }
}
