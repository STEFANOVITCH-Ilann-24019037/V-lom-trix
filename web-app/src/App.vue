<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import NavigationBar from './components/NavigationBar.vue'

const auth = useAuthStore()
const route = useRoute()

onMounted(() => auth.fetchUser())

const hideNav = ['Login', 'Register']
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <NavigationBar v-if="auth.token && !hideNav.includes(route.name)" />
    <router-view />
  </div>
</template>
