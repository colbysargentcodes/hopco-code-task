import type { InventoryItemData } from '@/types/inventoryItemData'

export class InventoryItem implements InventoryItemData {
  id: number
  productName: string
  manufacturer: string
  category: string
  quantity: number
  expiryDate?: string
  unitPrice?: number

  constructor(data: InventoryItemData) {
    this.id = data.id
    this.productName = data.productName
    this.manufacturer = data.manufacturer
    this.category = data.category
    this.quantity = data.quantity
    this.expiryDate = data.expiryDate
    this.unitPrice = data.unitPrice
  }
}
