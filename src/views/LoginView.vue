<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userApiService } from '@/services/userApiService'
import { useUserStore } from '@/stores/user'

const email = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()

// const emailRules = [
//   (v: string) => !!v || 'E-mail is required',
//   (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
// ]

// const passwordRules = [(v: string) => !!v || 'Password is required']

const rules = {
  email: [
    (v: string) => !!v || 'E-mail is required',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  ],
  password: [(v: string) => !!v || 'Password is required'],
}

const login = async () => {
  if (email.value && password.value) {
    try {
      const user = await userApiService.login(email.value, password.value)

      userStore.setUser(user)
      router.push('/hospital')
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message)
      } else {
        console.error('An error occurred during login.')
      }
    }
  }
}
</script>

<template>
  <v-form lazy-validation @submit.prevent="login">
    <v-container>
      <v-row>
        <v-col cols="12"><h3>Login</h3></v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="email"
            :rules="rules.email"
            name="email"
            label="E-mail"
            required
            variant="outlined"
            color="light-blue"
          />

          <v-text-field
            v-model="password"
            :rules="rules.password"
            name="password"
            label="Password"
            type="password"
            required
            variant="outlined"
            color="light-blue"
          />

          <v-btn color="light-blue" flat type="submit">Login</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
