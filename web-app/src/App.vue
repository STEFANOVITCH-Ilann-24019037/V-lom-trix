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
  <div style="min-height:100vh; background:#F7F8FA;"  >
    <NavigationBar v-if="auth.token && !hideNav.includes(route.name)" />
    <router-view />
  </div>
</template>
