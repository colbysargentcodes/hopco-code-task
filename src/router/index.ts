import { createRouter, createWebHistory } from 'vue-router'

import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import LoginView from '@/views/LoginView.vue'
import InventoryView from '@/views/InventoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/auth/login',
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: '',
          redirect: 'login',
        },
        {
          path: 'login',
          name: 'login',
          component: LoginView,
        },
      ],
    },
    {
      path: '/hospital',
      component: MainLayout,
      children: [
        {
          path: '',
          redirect: { name: 'inventory' },
        },
        {
          path: 'inventory',
          name: 'inventory',
          component: InventoryView,
        },
      ],
    },
  ],
})

export default router
