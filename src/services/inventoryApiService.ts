// @ts-expect-error import is intentionally untyped to simulate an untyped API response
import { inventories } from '@/fixtures/inventories'
import { Inventory } from '@/models/Inventory'
import { InventoryItem } from '@/models/InventoryItem'
import type { InventoryItemData } from '@/types/inventoryItemData'

class InventoryApiService {
  async getInventoryByHospitalId(hospitalId: number): Promise<Inventory> {
    const inventory: InventoryItemData[] | undefined = inventories[hospitalId]

    if (!inventory) {
      throw new Error('No inventory found for the specified hospital ID')
    }

    return Promise.resolve(new Inventory(inventory.map((item) => new InventoryItem(item))))
  }
}

export const inventoryApiService = new InventoryApiService()
