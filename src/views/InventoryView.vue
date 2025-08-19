<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DataTableHeader } from 'vuetify'
import { useUserStore } from '@/stores/user'
import { headersService } from '@/services/headersService'
import { inventoryApiService } from '@/services/inventoryApiService'
import { Inventory } from '@/models/Inventory'
import { InventoryItem } from '@/models/InventoryItem'
import InventoryItemFormDialog from '@/components/InventoryItemFormDialog.vue'

const userStore = useUserStore()

// Headers logic
const allHeaders: DataTableHeader[] = [
  {
    key: 'productName',
    value: 'productName',
    title: 'Product Name',
    sortable: true,
  },
  {
    key: 'manufacturer',
    value: 'manufacturer',
    title: 'Manufacturer',
    sortable: true,
  },
  {
    key: 'category',
    value: 'category',
    title: 'Category',
    sortable: true,
  },
  {
    key: 'quantity',
    value: 'quantity',
    title: 'Quantity',
    sortable: true,
    align: 'end',
  },
  {
    key: 'expiryDate',
    value: 'expiryDate',
    title: 'Expiry Date',
    sortable: true,
  },
  {
    key: 'unitPrice',
    value: 'unitPrice',
    title: 'Unit Price',
    sortable: true,
    align: 'end',
  },
]
const inventoryHeadersService = new headersService(allHeaders, userStore.inventoryHeadersConfig)

function getHeaders() {
  const headers = inventoryHeadersService.getHeaders()

  headers.push({
    key: 'actions',
    title: 'Actions',
    sortable: false,
    align: 'end',
  })

  return headers
}

// Inventory logic
const inventory = ref<Inventory | null>(null)

async function getInventory() {
  try {
    inventory.value = await inventoryApiService.getInventoryByHospitalId(userStore.hospitalId)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error retrieving inventory items:', error.message)
    } else {
      console.error('Error retrieving inventory items: An unexpected error occurred.')
    }
  }
}

onMounted(getInventory)

// CRUD logic
const isAddEditDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const isEditing = ref(false)
const activeItem = ref<InventoryItem | undefined>(undefined)

function openAddItemDialog() {
  isEditing.value = false
  activeItem.value = undefined
  isAddEditDialogOpen.value = true
}

function onNewItem(item: InventoryItem) {
  inventory.value?.items.push(item)
}

function openEditItemDialog(item: InventoryItem) {
  isEditing.value = true
  activeItem.value = item
  isAddEditDialogOpen.value = true
}

function onUpdatedItem(item: InventoryItem) {
  const index = inventory.value?.items.findIndex((i) => i.id === item.id)

  if (index !== undefined && index >= 0) {
    inventory.value!.items[index] = item
  }
}

function openDeleteItemDialog(item: InventoryItem) {
  activeItem.value = item
  isDeleteDialogOpen.value = true
}

function deleteItem(item: InventoryItem) {
  const index = inventory.value?.items.findIndex((i) => i.id === item.id)

  if (index !== undefined && index >= 0) {
    inventory.value!.items.splice(index, 1)
  }

  isDeleteDialogOpen.value = false
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <h1>Inventory management</h1>
      </v-col>

      <v-col cols="4" class="text-right">
        <v-btn
          color="success"
          variant="flat"
          @click="openAddItemDialog"
          data-testid="add-item-button"
          >Add Item</v-btn
        >
      </v-col>

      <v-col cols="12">
        <v-data-table
          :headers="getHeaders()"
          :items="inventory?.items || []"
          :items-per-page="10"
          :sort-by="[userStore.inventoryHeadersConfig.defaultSort]"
        >
          <template #item.expiryDate="{ value }">
            <span>{{
              new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }).format(new Date(value))
            }}</span>
          </template>

          <template #item.quantity="{ value }">
            <span>{{ value.toLocaleString() }}</span>
          </template>

          <template #item.unitPrice="{ value }">
            <span>{{
              new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value)
            }}</span>
          </template>

          <template #item.actions="{ item }">
            <v-btn
              icon
              variant="flat"
              size="small"
              @click="openEditItemDialog(item)"
              data-testid="edit-item-button"
            >
              <v-icon icon="mdi-pencil" />
            </v-btn>

            <v-btn
              icon
              variant="flat"
              size="small"
              @click="openDeleteItemDialog(item)"
              data-testid="delete-item-button"
            >
              <v-icon icon="mdi-delete" />
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>

  <InventoryItemFormDialog
    v-model="isAddEditDialogOpen"
    :active-item="activeItem"
    :is-editing="isEditing"
    @newItem="onNewItem"
    @updatedItem="onUpdatedItem"
  />

  <v-dialog v-model="isDeleteDialogOpen" max-width="500px" data-testid="delete-item-dialog">
    <v-sheet>
      <v-container>
        <v-row>
          <v-col cols="12">
            <h3>Confirm Deletion of '{{ activeItem?.productName }}'</h3>
            <p>Are you sure you want to delete this item?</p>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <v-btn variant="outlined" @click="isDeleteDialogOpen = false">Cancel</v-btn>
          </v-col>

          <v-col cols="6" class="text-right">
            <v-btn color="error" variant="flat" @click="deleteItem(activeItem!)">Delete</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </v-dialog>
</template>
