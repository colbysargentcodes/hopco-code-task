<script setup lang="ts">
import { ref, defineProps, watch } from 'vue'
import { InventoryItem } from '@/models/InventoryItem'
import type { InventoryItemData } from '@/types/inventoryItemData'

const dialogIsOpen = defineModel<boolean>()

const props = defineProps<{
  activeItem?: InventoryItem
  isEditing: boolean
}>()

const emit = defineEmits<{
  (event: 'newItem', item: InventoryItem): void
  (event: 'updatedItem', item: InventoryItem): void
}>()

const newItem = {
  id: undefined,
  productName: '',
  manufacturer: '',
  category: '',
  quantity: undefined,
  expiryDate: '',
  unitPrice: undefined,
}

const item = ref<Partial<InventoryItemData>>({ ...newItem })

const rules = {
  productName: [(v: string) => !!v || 'Product name is required'],
  manufacturer: [(v: string) => !!v || 'Manufacturer is required'],
  category: [(v: string) => !!v || 'Category is required'],
  quantity: [(v: number) => v >= 0 || 'Quantity must be a number greater than or equal to 0'],
  expiryDate: [(v: string) => !!v || 'Expiry date is required'],
  unitPrice: [(v: number) => v >= 0 || 'Unit price must be a number greater than or equal to 0'],
}

watch(
  () => dialogIsOpen.value,
  (val) => {
    if (val && props.isEditing) {
      // If dialog is opened for editing, populate the form with the active item data
      if (props.activeItem) {
        item.value = { ...props.activeItem }
      } else {
        console.error('No inventory item provided for editing.')
        dialogIsOpen.value = false
      }
    } else {
      // Reset the form when dialog is closed
      item.value = { ...newItem }
    }
  },
)

const form = ref<HTMLFormElement | null>(null)

function saveItem() {
  if (form.value && form.value.validate()) {
    const validatedItemData = item.value
    validatedItemData.expiryDate = new Date(validatedItemData.expiryDate as string)
      .toISOString()
      .slice(0, 10)

    // Generate a new ID if not editing
    if (!props.isEditing) {
      validatedItemData.id = Date.now() + Math.floor(Math.random() * 10000)
    }

    const validatedItem = new InventoryItem(validatedItemData as InventoryItemData)

    if (props.isEditing) {
      emit('updatedItem', validatedItem)
    } else {
      emit('newItem', validatedItem)
    }

    dialogIsOpen.value = false
  }
}
</script>

<template>
  <v-dialog v-model="dialogIsOpen" max-width="500px" persistent color="white">
    <v-sheet>
      <v-form ref="form" lazy-validation @submit.prevent="saveItem">
        <v-container>
          <v-row>
            <v-col cols="12">
              <h3>{{ props.isEditing ? 'Edit' : 'Add' }} Inventory Item</h3>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="item.productName"
                :rules="rules.productName"
                label="Product Name"
                required
                variant="outlined"
              />

              <v-text-field
                v-model="item.manufacturer"
                :rules="rules.manufacturer"
                label="Manufacturer"
                required
                variant="outlined"
              />

              <v-text-field
                v-model="item.category"
                :rules="rules.category"
                label="Category"
                required
                variant="outlined"
              />

              <v-number-input
                v-model="item.quantity"
                :rules="rules.quantity"
                label="Quantity"
                required
                :min="0"
                variant="outlined"
                control-variant="stacked"
              />

              <v-date-input
                v-model="item.expiryDate"
                :rules="rules.expiryDate"
                label="Expiry Date"
                required
                variant="outlined"
                prepend-icon=""
                append-inner-icon="$calendar"
                input-format="dd/mm/yyyy"
              />

              <v-number-input
                v-model="item.unitPrice"
                :rules="rules.unitPrice"
                label="Unit Price"
                required
                :precision="2"
                variant="outlined"
                control-variant="stacked"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-btn @click="dialogIsOpen = false" variant="outlined">Cancel</v-btn>
            </v-col>

            <v-col cols="6" class="text-right">
              <v-btn type="submit" color="success" variant="flat">Save</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-sheet>
  </v-dialog>
</template>

<style scoped>
.v-input + .v-input {
  margin-top: 12px;
}
</style>
