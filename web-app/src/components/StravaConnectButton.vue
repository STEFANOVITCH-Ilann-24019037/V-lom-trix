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
  <button @click="connectStrava" :disabled="loading"
    style="display:inline-flex; align-items:center; gap:8px; background:#FC4C02; color:#fff; font-family:'DM Sans',sans-serif; font-weight:600; font-size:13px; padding:9px 16px; border-radius:8px; border:none; cursor:pointer; transition:opacity 0.2s; white-space:nowrap;"
    :style="{ opacity: loading ? 0.6 : 1 }">
    <svg width="15" height="15" fill="white" viewBox="0 0 24 24">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169"/>
    </svg>
    {{ loading ? 'Redirection…' : 'Connecter Strava' }}
  </button>
</template>
