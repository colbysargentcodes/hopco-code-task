import { globalPlugins } from '@/test/setup'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { InventoryItem } from '@/models/InventoryItem'
import { Inventory } from '@/models/Inventory'
import InventoryView from '../InventoryView.vue'

vi.mock('@/services/inventoryApiService', () => ({
  inventoryApiService: {
    getInventoryByHospitalId: vi.fn().mockResolvedValue(
      new Inventory([
        new InventoryItem({
          id: 1,
          productName: 'Test Syringe',
          manufacturer: 'TestMed',
          category: 'Injection',
          quantity: 100,
          expiryDate: '2026-12-31',
          unitPrice: 1.5,
        }),
      ]),
    ),
  },
}))

vi.mock('@/stores/user', () => ({
  useUserStore: () => ({
    hospitalId: 1,
    inventoryHeadersConfig: {
      fields: ['productName'],
      defaultSort: { key: 'productName', order: 'asc' },
    },
  }),
}))

describe('InventoryView', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(InventoryView, {
      global: {
        plugins: globalPlugins,
      },
    })

    await flushPromises()
  })

  it('renders inventory table with items', () => {
    expect(wrapper.find('h1').text()).toContain('Inventory management')
    expect(wrapper.findAll('tbody tr').length).toBe(1)
    expect(wrapper.findAll('tbody tr').at(0).text()).toContain('Test Syringe')
  })

  it('opens add item dialog when Add Item button is clicked', async () => {
    const addBtn = wrapper.findAll('button').find((btn) => btn.text().includes('Add Item'))
    await addBtn?.trigger('click')

    expect(wrapper.findComponent({ name: 'InventoryItemFormDialog' }).props('isEditing')).toBe(
      false,
    )
    expect(
      wrapper.findComponent({ name: 'InventoryItemFormDialog' }).props('activeItem'),
    ).toBeUndefined()
  })

  it('opens edit dialog when edit button is clicked', async () => {
    const editBtn = wrapper.findAll('button').find((btn) => btn.html().includes('mdi-pencil'))
    await editBtn?.trigger('click')

    expect(wrapper.findComponent({ name: 'InventoryItemFormDialog' }).props('isEditing')).toBe(true)
    expect(
      wrapper.findComponent({ name: 'InventoryItemFormDialog' }).props('activeItem').productName,
    ).toBe('Test Syringe')
  })
})
