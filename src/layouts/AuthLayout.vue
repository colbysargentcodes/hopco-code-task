<script setup lang="ts"></script>

<template>
  <div class="auth-layout">
    <header>
      <h1>HOPCo task</h1>
      <h2>Colby Sargent</h2>
    </header>

    <main>
      <v-sheet width="320" :elevation="12" rounded>
        <router-view />
      </v-sheet>
    </main>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: url('@/assets/auth-bg.png') center center/cover no-repeat;
  color: white;
  text-align: center;
}

header {
  padding: 3rem 0;
}

main {
  flex: 1;
  display: flex;
  justify-content: center;
}
</style>
