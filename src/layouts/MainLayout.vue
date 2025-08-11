<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppNav from '@/components/AppNav.vue'
</script>

<template>
  <div class="main-layout">
    <AppHeader />
    <AppNav />

    <v-main color="grey lighten-4">
      <div class="pa-4">
        <router-view />
      </div>
    </v-main>
  </div>
</template>
