import { describe, it, expect, vi } from 'vitest'
import { userApiService } from '../userApiService'

vi.mock('@/fixtures/users', () => ({
  users: [
    {
      id: 1,
      name: 'Mock User',
      email: 'mock@hospital.com',
      hospital: {
        id: 1,
        name: 'Mock Hospital',
        config: { inventoryFields: [] },
      },
    },
  ],
}))

// @ts-expect-error import is intentionally untyped to simulate an untyped API response
import { users as mockUsers } from '@/fixtures/users'
const validUser = mockUsers[0]
const invalidEmail = 'not.a.user@hospital.com'

describe('UserApiService', () => {
  it('returns user for valid email', async () => {
    const user = await userApiService.login(validUser.email, 'anyPassword')
    expect(user).toEqual(validUser)
  })

  it('throws error for invalid email', async () => {
    await expect(userApiService.login(invalidEmail, 'anyPassword')).rejects.toThrow(
      'Invalid username or password',
    )
  })
})
