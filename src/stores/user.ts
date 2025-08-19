import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import type { HeadersConfig } from '@/types/configs'

const defaultInventoryHeadersConfig: HeadersConfig = {
  fields: ['productName', 'category', 'manufacturer', 'quantity'],
  defaultSort: { key: 'productName', order: 'asc' },
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  const hospitalId = computed(() => user.value?.hospital.id || 0)
  const inventoryHeadersConfig = computed(
    () => user.value?.hospital.config.inventoryHeaders || defaultInventoryHeadersConfig,
  )

  function setUser(userData: User) {
    user.value = userData
  }

  function clearUser() {
    user.value = null
  }

  return { user, hospitalId, inventoryHeadersConfig, setUser, clearUser }
})
