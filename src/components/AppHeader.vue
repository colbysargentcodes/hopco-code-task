<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const hospitalName = computed(() => userStore.user?.hospital.name)

function signOut() {
  userStore.clearUser()
  router.push('/')
}
</script>

<template>
  <v-app-bar flat color="indigo">
    <v-app-bar-title>{{ hospitalName }}</v-app-bar-title>

    <v-menu offset-y>
      <template #activator="{ props }">
        <v-btn icon v-bind="props"><v-icon icon="mdi-account-circle" /></v-btn>
      </template>

      <v-list>
        <v-list-item>
          <strong>{{ userStore.user?.name }}</strong>
        </v-list-item>
        <v-divider />

        <v-list-item @click="signOut">Sign out</v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
