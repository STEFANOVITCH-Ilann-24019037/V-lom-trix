<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.message || 'Identifiants incorrects.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <span class="text-5xl">🚴</span>
        <h1 class="text-2xl font-bold text-gray-900 mt-2">Vélométrix</h1>
        <p class="text-gray-500 text-sm">Maintenance prédictive pour votre vélo</p>
      </div>
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="email" type="email" required
            class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input v-model="password" type="password" required
            class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
        </div>
        <p v-if="error" class="text-danger text-sm">{{ error }}</p>
        <button type="submit" :disabled="loading"
          class="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>
      <p class="text-center text-sm text-gray-500 mt-6">
        Pas de compte ?
        <router-link to="/register" class="text-primary font-medium hover:underline">S'inscrire</router-link>
      </p>
    </div>
  </div>
</template>
