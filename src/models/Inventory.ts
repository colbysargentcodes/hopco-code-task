import { InventoryItem } from './InventoryItem'

export class Inventory {
  items: InventoryItem[]

  constructor(items: InventoryItem[]) {
    this.items = items.map((item) => new InventoryItem(item))
  }
}
