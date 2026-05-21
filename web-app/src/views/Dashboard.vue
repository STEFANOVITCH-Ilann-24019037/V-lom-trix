<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/client'
import { useAuthStore } from '../stores/authStore'
import BikeCard from '../components/BikeCard.vue'
import StravaConnectButton from '../components/StravaConnectButton.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const auth = useAuthStore()
const dashboard = ref(null)
const loading = ref(true)
const syncing = ref(false)
const showAddModal = ref(false)
const newBike = ref({ name: '', type: 'route', initial_km: 0 })
const addLoading = ref(false)

async function load() {
  loading.value = true
  const { data } = await api.get('/dashboard')
  dashboard.value = data
  loading.value = false
}

async function sync() {
  syncing.value = true
  await api.post('/sync')
  await load()
  syncing.value = false
}

async function addBike() {
  addLoading.value = true
  await api.post('/bikes', newBike.value)
  showAddModal.value = false
  newBike.value = { name: '', type: 'route', initial_km: 0 }
  await load()
  addLoading.value = false
}

onMounted(load)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500 mt-1" v-if="dashboard">
          {{ dashboard.stats.nb_bikes }} vélo(s) · {{ dashboard.stats.total_km.toLocaleString() }} km total
        </p>
      </div>
      <div class="flex items-center gap-3">
        <StravaConnectButton v-if="dashboard && !dashboard.strava_connected" />
        <button v-if="dashboard?.strava_connected" @click="sync" :disabled="syncing"
          class="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60 text-sm">
          {{ syncing ? 'Synchro...' : '⟳ Synchroniser Strava' }}
        </button>
        <button @click="showAddModal = true"
          class="bg-primary text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm">
          + Ajouter un vélo
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <template v-else-if="dashboard">
      <div v-if="dashboard.bikes.length === 0" class="text-center py-20 text-gray-400">
        <span class="text-6xl">🚴</span>
        <p class="mt-4 text-lg">Aucun vélo pour l'instant</p>
        <button @click="showAddModal = true" class="mt-4 text-primary font-medium hover:underline">Ajouter votre premier vélo</button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <BikeCard v-for="bike in dashboard.bikes" :key="bike.id" :bike="bike" />
      </div>

      <div v-if="dashboard.last_activities.length > 0">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Dernières activités Strava</h2>
        <div class="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 shadow-sm">
          <div v-for="act in dashboard.last_activities" :key="act.id" class="flex items-center justify-between px-6 py-4">
            <div>
              <p class="font-medium text-gray-800">{{ act.name }}</p>
              <p class="text-sm text-gray-500">{{ act.type }}</p>
            </div>
            <span class="font-semibold text-primary">{{ act.distance_km }} km</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal ajout vélo -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 class="text-xl font-bold mb-5">Nouveau vélo</h2>
        <form @submit.prevent="addBike" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input v-model="newBike.name" required class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select v-model="newBike.type" class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="route">Route</option>
              <option value="vtt">VTT</option>
              <option value="ville">Ville</option>
              <option value="gravel">Gravel</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kilométrage initial (km)</label>
            <input v-model.number="newBike.initial_km" type="number" min="0"
              class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="showAddModal = false"
              class="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
              Annuler
            </button>
            <button type="submit" :disabled="addLoading"
              class="flex-1 bg-primary text-white py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 text-sm font-semibold">
              {{ addLoading ? 'Création...' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
