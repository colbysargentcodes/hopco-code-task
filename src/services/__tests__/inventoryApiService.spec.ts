import { describe, it, expect, vi } from 'vitest'
import { inventoryApiService } from '../inventoryApiService'
import { Inventory } from '@/models/Inventory'

vi.mock('@/fixtures/inventories', () => ({
  inventories: {
    1: [
      {
        id: 1,
        productName: 'Insulin Pen',
        manufacturer: 'GlucoLife',
        category: 'Injection',
        quantity: 100,
        unitPrice: 45.99,
      },
      {
        id: 2,
        productName: 'ECG Machine',
        manufacturer: 'HeartTech',
        category: 'Diagnostics',
        quantity: 5,
        unitPrice: 1200.0,
      },
    ],
  },
}))

// @ts-expect-error import is intentionally untyped to simulate an untyped API response
import { inventories as mockInventories } from '@/fixtures/inventories'
const validHospitalId = 1
const invalidHospitalId = 99

describe('InventoryApiService', () => {
  it('returns inventory for valid hospital ID', async () => {
    const inventory = await inventoryApiService.getInventoryByHospitalId(validHospitalId)

    expect(inventory instanceof Inventory).toBe(true)
    expect(inventory.items.length).toBeGreaterThan(0)
    expect(inventory.items).toEqual(mockInventories[validHospitalId])
  })

  it('throws error for invalid hospital ID', async () => {
    await expect(inventoryApiService.getInventoryByHospitalId(invalidHospitalId)).rejects.toThrow(
      'No inventory found for the specified hospital ID',
    )
  })
})
