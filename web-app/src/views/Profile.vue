<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const router = useRouter()

async function logout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Mon profil</h1>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
          {{ auth.user?.name?.charAt(0).toUpperCase() }}
        </div>
        <div>
          <p class="font-semibold text-lg text-gray-900">{{ auth.user?.name }}</p>
          <p class="text-gray-500 text-sm">{{ auth.user?.email }}</p>
        </div>
      </div>
      <div class="border-t border-gray-100 pt-4">
        <p class="text-sm text-gray-500">
          Strava :
          <span v-if="auth.user?.strava_connected" class="text-success font-medium">Connecté</span>
          <span v-else class="text-gray-400">Non connecté</span>
        </p>
      </div>
    </div>

    <button @click="logout"
      class="w-full border border-red-200 text-red-500 font-semibold py-3 rounded-xl hover:bg-red-50 transition-colors">
      Se déconnecter
    </button>
  </div>
</template>
