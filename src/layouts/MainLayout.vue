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

<style scoped>
/* .main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f7f8fa;
}

header {
  padding: 2rem 0 1rem 0;
  text-align: center;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
} */
</style>
