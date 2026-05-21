<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/client'
import PartProgress from '../components/PartProgress.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const route = useRoute()
const router = useRouter()
const bike = ref(null)
const loading = ref(true)

async function load() {
  loading.value = true
  const { data } = await api.get(`/bikes/${route.params.id}`)
  bike.value = data
  loading.value = false
}

async function handleDelete() {
  if (!confirm('Supprimer ce vélo définitivement ?')) return
  await api.delete(`/bikes/${route.params.id}`)
  router.push('/dashboard')
}

const typeLabel = { route: 'Route', vtt: 'VTT', ville: 'Ville', gravel: 'Gravel' }

onMounted(load)
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <button @click="router.push('/dashboard')" class="text-primary mb-6 flex items-center gap-1 hover:underline text-sm">
      ← Retour au dashboard
    </button>

    <LoadingSpinner v-if="loading" />

    <template v-else-if="bike">
      <div class="flex items-start justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ bike.name }}</h1>
          <div class="flex items-center gap-3 mt-2">
            <span class="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{{ typeLabel[bike.type] }}</span>
            <span class="text-sm text-gray-500">{{ bike.current_km.toLocaleString() }} km</span>
          </div>
        </div>
        <button @click="handleDelete" class="text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors">
          Supprimer
        </button>
      </div>

      <h2 class="text-xl font-semibold text-gray-800 mb-4">Pièces</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PartProgress
          v-for="part in bike.parts"
          :key="part.id"
          :part="part"
          @changed="load"
        />
      </div>
    </template>
  </div>
</template>
