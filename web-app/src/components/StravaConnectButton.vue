<script setup>
import { ref } from 'vue'
import api from '../api/client'

const loading = ref(false)

async function connectStrava() {
  loading.value = true
  const { data } = await api.get('/strava/redirect')
  window.location.href = data.url
}
</script>

<template>
  <button
    @click="connectStrava"
    :disabled="loading"
    class="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60"
  >
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169"/>
    </svg>
    {{ loading ? 'Redirection...' : 'Connecter Strava' }}
  </button>
</template>
