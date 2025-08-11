// @ts-expect-error import is intentionally untyped to simulate an untyped API response
import { users } from '@/fixtures/users'
import type { User } from '@/types/user'

class UserApiService {
  async login(email: string, password: string): Promise<User> {
    const user: User | undefined = users.find((user: User) => user.email === email && password)

    if (!user) {
      throw new Error('Invalid username or password')
    }

    return Promise.resolve(user)
  }
}

export const userApiService = new UserApiService()
