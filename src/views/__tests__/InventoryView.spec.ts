import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { queryByTestId } from '@testing-library/dom'
import { nextTick } from 'vue'
import type { DataTableHeader } from 'vuetify'
import { globalPlugins } from '@/test/setup'
import { InventoryItem } from '@/models/InventoryItem'
import { Inventory } from '@/models/Inventory'
import InventoryView from '../InventoryView.vue'

vi.mock('@/services/inventoryApiService', () => ({
  inventoryApiService: {
    getInventoryByHospitalId: vi.fn().mockImplementation(
      () =>
        new Inventory([
          new InventoryItem({
            id: 1,
            productName: 'Test Syringe',
            manufacturer: 'TestMed',
            category: 'Injection',
            quantity: 3500,
            expiryDate: '2026-12-31',
            unitPrice: 1.5,
          }),
          new InventoryItem({
            id: 2,
            productName: 'Test MRI',
            manufacturer: 'TestMed',
            category: 'Diagnostics',
            quantity: 3,
            expiryDate: '2035-09-14',
            unitPrice: 5000,
          }),
        ]),
    ),
  },
}))

describe('InventoryView', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(async () => {
    wrapper = mount(InventoryView, {
      global: {
        plugins: [
          ...globalPlugins,
          createTestingPinia({
            initialState: {
              user: {
                user: {
                  id: 1,
                  name: 'Test User',
                  email: 'test@hospital.com',
                  hospital: {
                    id: 1,
                    name: 'Test Hospital',
                    config: {
                      inventoryHeaders: {
                        fields: [
                          'productName',
                          'expiryDate',
                          'unitPrice',
                          'quantity',
                          'nonExistingHeader',
                        ],
                        defaultSort: { key: 'unitPrice', order: 'desc' },
                      },
                    },
                  },
                },
              },
            },
          }),
        ],
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('has expected allHeaders values', () => {
    // @ts-expect-error: allHeaders is not typed on the component instance
    const allHeaders = wrapper.vm.allHeaders
    const allHeadersByKey = Object.fromEntries(
      allHeaders.map((header: { key: DataTableHeader }) => [header.key, header]),
    )

    expect(allHeaders.length).toBe(6)
    expect(allHeadersByKey.productName).toEqual({
      key: 'productName',
      value: 'productName',
      title: 'Product Name',
      sortable: true,
    })
    expect(allHeadersByKey.manufacturer).toEqual({
      key: 'manufacturer',
      value: 'manufacturer',
      title: 'Manufacturer',
      sortable: true,
    })
    expect(allHeadersByKey.category).toEqual({
      key: 'category',
      value: 'category',
      title: 'Category',
      sortable: true,
    })
    expect(allHeadersByKey.quantity).toEqual({
      key: 'quantity',
      value: 'quantity',
      title: 'Quantity',
      sortable: true,
      align: 'end',
    })
    expect(allHeadersByKey.expiryDate).toEqual({
      key: 'expiryDate',
      value: 'expiryDate',
      title: 'Expiry Date',
      sortable: true,
    })
    expect(allHeadersByKey.unitPrice).toEqual({
      key: 'unitPrice',
      value: 'unitPrice',
      title: 'Unit Price',
      sortable: true,
      align: 'end',
    })
  })

  it('renders inventory title and table with items', () => {
    expect(wrapper.find('h1').text()).toContain('Inventory management')
    expect(wrapper.findAll('tbody tr').length).toBe(2)
    expect(wrapper.findAll('tbody tr').at(0)!.text()).toContain('Test MRI')
    expect(wrapper.findAll('tbody tr').at(1)!.text()).toContain('Test Syringe')
  })

  it('displays only headers defined in config, in defined order, excluding headers not present in AllHeaders Array, followed by actions header', () => {
    const headers = wrapper.findAll('th')

    expect(headers.map((h) => h.text())).toEqual([
      'Product Name',
      'Expiry Date',
      'Unit Price',
      'Quantity',
      'Actions',
    ])
  })

  it('applies sorting to table based on config', () => {
    const unitPriceHeader = wrapper.findAll('th').find((th) => th.text() === 'Unit Price')
    expect(unitPriceHeader).toBeDefined()
    const sortIcon = unitPriceHeader!.find('.v-data-table-header__sort-icon')
    expect(sortIcon).toBeDefined()

    expect(unitPriceHeader!.classes()).toContain('v-data-table__th--sorted')
    expect(sortIcon!.classes()).toContain('mdi-arrow-down') // is descending
    expect(wrapper.findAll('tbody tr').at(0)!.text()).toContain('Test MRI')
    expect(wrapper.findAll('tbody tr').at(1)!.text()).toContain('Test Syringe')
  })

  it('formats quantity, unit price, and expiry date columns as expected', () => {
    const rows = wrapper.findAll('tbody tr')
    const mriRow = rows.at(0)!
    const syringeRow = rows.at(1)!

    expect(mriRow.findAll('td').at(1)?.text()).toBe('14/09/2035') // formatted expiry date
    expect(mriRow.findAll('td').at(2)?.text()).toBe('£5,000.00') // formatted unit price
    expect(mriRow.findAll('td').at(3)?.text()).toBe('3') // formatted quantity

    expect(syringeRow.findAll('td').at(1)?.text()).toBe('31/12/2026') // formatted expiry date
    expect(syringeRow.findAll('td').at(2)?.text()).toBe('£1.50') // formatted unit price
    expect(syringeRow.findAll('td').at(3)?.text()).toBe('3,500') // formatted quantity
  })

  it('opens add item dialog when "Add Item" button is clicked', async () => {
    expect(wrapper.findComponent({ name: 'InventoryItemFormDialog' }).isVisible()).toBe(true)
    const addBtn = wrapper.findAll('button').find((btn) => btn.text().includes('Add Item'))
    await addBtn?.trigger('click')

    expect(wrapper.findComponent({ name: 'InventoryItemFormDialog' }).props('isEditing')).toBe(
      false,
    )
    expect(
      wrapper.findComponent({ name: 'InventoryItemFormDialog' }).props('activeItem'),
    ).toBeUndefined()
  })

  it('adds new item to inventory when child dialog emits newItem event', async () => {
    const newItem = new InventoryItem({
      id: 3,
      productName: 'Test Bandage',
      manufacturer: 'TestMed',
      category: 'Wound Care',
      quantity: 200,
      expiryDate: '2025-12-31',
      unitPrice: 0.75,
    })
    wrapper.findComponent({ name: 'InventoryItemFormDialog' }).vm.$emit('newItem', newItem)
    await nextTick()

    expect(wrapper.findAll('tbody tr').length).toBe(3)
    expect(wrapper.findAll('tbody tr').at(2)!.text()).toContain('Test Bandage')
  })

  it('opens edit item dialog when edit button is clicked', async () => {
    const editButton = wrapper.findAll('tbody tr').at(1)!.find('[data-testid="edit-item-button"]') // Test Syringe row
    await editButton?.trigger('click')

    expect(wrapper.findComponent({ name: 'InventoryItemFormDialog' }).props('isEditing')).toBe(true)
    expect(
      wrapper.findComponent({ name: 'InventoryItemFormDialog' }).props('activeItem').productName,
    ).toBe('Test Syringe')
  })

  it('updates existing item in inventory when child dialog emits updatedItem event', async () => {
    const updatedItem = new InventoryItem({
      id: 2,
      productName: 'Test MRI Updated',
      manufacturer: 'TestMed',
      category: 'Diagnostics',
      quantity: 3,
      expiryDate: '2035-09-14',
      unitPrice: 5000,
    })

    expect(wrapper.findAll('tbody tr').length).toBe(2)
    expect(wrapper.findAll('tbody tr').at(0)!.text()).toContain('Test MRI')

    wrapper.findComponent({ name: 'InventoryItemFormDialog' }).vm.$emit('updatedItem', updatedItem)
    await nextTick()

    expect(wrapper.findAll('tbody tr').length).toBe(2)
    expect(wrapper.findAll('tbody tr').at(0)!.text()).toContain('Test MRI Updated')
  })

  it('removes item from inventory when delete button is clicked and dialog is confirmed', async () => {
    // confirm number of rows and first row item (Test MRI)
    expect(wrapper.findAll('tbody tr').length).toBe(2)
    expect(wrapper.findAll('tbody tr').at(0)!.text()).toContain('Test MRI')

    let confirmDeleteDialog = queryByTestId(document.body, 'delete-item-dialog')
    expect(confirmDeleteDialog).toBeNull()

    // click delete button on first row item (Test MRI)
    const deleteButton = wrapper
      .findAll('tbody tr')
      .at(0)!
      .find('[data-testid="delete-item-button"]')
    await deleteButton?.trigger('click')

    confirmDeleteDialog = queryByTestId(document.body, 'delete-item-dialog')
    expect(confirmDeleteDialog).toBeVisible()

    // click confirm button on delete confirmation dialog
    const confirmButton = Array.from(confirmDeleteDialog!.querySelectorAll('button')).find((btn) =>
      (btn as HTMLButtonElement).textContent?.toLowerCase().includes('delete'),
    ) as HTMLButtonElement | undefined

    expect(confirmButton).toBeDefined()

    confirmButton!.click()
    await nextTick()

    // confirm number of rows is reduced by 1 and first row item has changed
    expect(wrapper.findAll('tbody tr').length).toBe(1)
    expect(wrapper.findAll('tbody tr').at(0)!.text()).toContain('Test Syringe')
  })

  it('does not remove item from inventory when delete button is clicked and dialog is cancelled', async () => {
    // confirm number of rows and first row item (Test MRI)
    expect(wrapper.findAll('tbody tr').length).toBe(2)
    expect(wrapper.findAll('tbody tr').at(0)!.text()).toContain('Test MRI')

    let confirmDeleteDialog = queryByTestId(document.body, 'delete-item-dialog')
    expect(confirmDeleteDialog).toBeNull()

    // click delete button on first row item (Test MRI)
    const deleteButton = wrapper
      .findAll('tbody tr')
      .at(0)!
      .find('[data-testid="delete-item-button"]')
    await deleteButton?.trigger('click')

    confirmDeleteDialog = queryByTestId(document.body, 'delete-item-dialog')
    expect(confirmDeleteDialog).toBeVisible()

    // click cancel button on delete confirmation dialog
    const cancelButton = Array.from(confirmDeleteDialog!.querySelectorAll('button')).find((btn) =>
      (btn as HTMLButtonElement).textContent?.toLowerCase().includes('cancel'),
    ) as HTMLButtonElement | undefined

    expect(cancelButton).toBeDefined()

    cancelButton!.click()
    await nextTick()

    // confirm number of rows and first row item remain unaffected
    expect(wrapper.findAll('tbody tr').length).toBe(2)
    expect(wrapper.findAll('tbody tr').at(0)!.text()).toContain('Test MRI')
  })
})
