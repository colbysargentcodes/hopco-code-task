import type { HeadersConfig } from '@/types/configs'
import type { InventoryField } from '@/types/fields'

export type Hospital = {
  id: number
  name: string
  config: {
    inventoryHeaders: HeadersConfig<InventoryField>
  }
}
