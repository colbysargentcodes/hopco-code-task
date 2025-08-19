import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { User } from '@/types/user'
import { useUserStore } from '../user'

const mockUser: User = {
  id: 1,
  name: 'Test User',
  email: 'test@hospital.com',
  hospital: {
    id: 1,
    name: 'Test Hospital',
    config: {
      inventoryHeaders: {
        fields: ['productName', 'quantity'],
        defaultSort: { key: 'productName', order: 'asc' },
      },
    },
  },
}

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with user as null', () => {
    const store = useUserStore()

    expect(store.user).toBeNull()
  })

  it('sets user with setUser', () => {
    const store = useUserStore()
    store.setUser(mockUser)

    expect(store.user).toEqual(mockUser)
  })

  it('clears user with clearUser', () => {
    const store = useUserStore()
    store.setUser(mockUser)
    store.clearUser()

    expect(store.user).toBeNull()
  })

  it('hospitalId returns default config when user is null', () => {
    const store = useUserStore()

    expect(store.hospitalId).toEqual(0)
  })

  it('hospitalId returns expected ID when user is set', () => {
    const store = useUserStore()
    store.setUser(mockUser)

    expect(store.hospitalId).toEqual(mockUser.hospital.id)
  })

  it('inventoryHeadersConfig returns default config when user is null', () => {
    const store = useUserStore()

    expect(store.inventoryHeadersConfig).toEqual({
      fields: ['productName', 'category', 'manufacturer', 'quantity'],
      defaultSort: { key: 'productName', order: 'asc' },
    })
  })

  it('inventoryHeadersConfig returns expected fields when user is set', () => {
    const store = useUserStore()
    store.setUser(mockUser)

    expect(store.inventoryHeadersConfig).toEqual(mockUser.hospital.config.inventoryHeaders)
  })
})
