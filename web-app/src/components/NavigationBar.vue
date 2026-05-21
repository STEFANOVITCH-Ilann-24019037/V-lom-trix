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
  <nav class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
      <router-link to="/dashboard" class="flex items-center gap-2 font-bold text-xl text-primary">
        <span>🚴</span> Vélométrix
      </router-link>
      <div class="flex items-center gap-6">
        <router-link to="/dashboard" class="text-gray-600 hover:text-primary transition-colors">Dashboard</router-link>
        <router-link to="/profile" class="text-gray-600 hover:text-primary transition-colors">Profil</router-link>
        <button @click="logout" class="text-sm text-red-500 hover:text-red-700 transition-colors">Déconnexion</button>
      </div>
    </div>
  </nav>
</template>
