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
  <div style="max-width:1100px; margin:0 auto; padding:36px 24px;">

    <!-- Header -->
    <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:32px; flex-wrap:wrap; gap:16px;" class="fade-up">
      <div>
        <p style="font-size:12px; font-weight:600; letter-spacing:0.08em; color:var(--muted); margin:0 0 6px; text-transform:uppercase;">Tableau de bord</p>
        <h1 style="font-family:'Syne',sans-serif; font-weight:700; font-size:34px; color:var(--text); margin:0; line-height:1.1; letter-spacing:-0.02em;">
          Bonjour, {{ auth.user?.name?.split(' ')[0] }} 👋
        </h1>
        <p v-if="dashboard" style="font-size:13px; color:var(--muted); margin:8px 0 0; font-family:'DM Mono',monospace;">
          {{ dashboard.stats.nb_bikes }} vélo{{ dashboard.stats.nb_bikes > 1 ? 's' : '' }} · {{ dashboard.stats.total_km.toLocaleString() }} km total
        </p>
      </div>
      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <StravaConnectButton v-if="dashboard && !dashboard.strava_connected" />
        <button v-if="dashboard?.strava_connected" @click="sync" :disabled="syncing" class="btn-secondary"
          style="display:inline-flex; align-items:center; gap:7px; color:#FC4C02; border-color:#FC4C02;"
          :style="{ opacity: syncing ? 0.6 : 1 }">
          <svg v-if="!syncing" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
          {{ syncing ? 'Synchro…' : 'Synchroniser Strava' }}
        </button>
        <button @click="showAddModal = true" class="btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 11H13V5H11V11H5V13H11V19H13V13H19V11Z"/></svg>
          Ajouter un vélo
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <template v-else-if="dashboard">

      <!-- Empty state -->
      <div v-if="dashboard.bikes.length === 0"
        style="text-align:center; padding:80px 20px; border:2px dashed var(--border); border-radius:16px; background:var(--white);">
        <div style="font-size:52px; margin-bottom:16px;">🚴</div>
        <h2 style="font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:var(--text); margin:0 0 8px;">Aucun vélo enregistré</h2>
        <p style="color:var(--muted); font-size:14px; margin:0 0 24px;">Ajoutez votre premier vélo pour commencer le suivi de maintenance</p>
        <button @click="showAddModal = true" class="btn-primary">
          Ajouter un vélo
        </button>
      </div>

      <!-- Bikes grid -->
      <div v-else style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:16px; margin-bottom:40px;">
        <div v-for="(bike, i) in dashboard.bikes" :key="bike.id" class="fade-up" :style="{ animationDelay: `${i * 0.07}s` }">
          <BikeCard :bike="bike" />
        </div>
      </div>

      <!-- Strava activities -->
      <div v-if="dashboard.last_activities?.length > 0">
        <p style="font-size:12px; font-weight:600; letter-spacing:0.08em; color:var(--muted); margin:0 0 12px; text-transform:uppercase;">Dernières activités Strava</p>
        <div class="card" style="overflow:hidden; padding:0;">
          <div v-for="(act, i) in dashboard.last_activities" :key="act.id"
            :style="{ borderTop: i > 0 ? '1px solid var(--border)' : 'none', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px' }">
            <div>
              <p style="font-size:14px; font-weight:600; color:var(--text); margin:0 0 2px;">{{ act.name }}</p>
              <p style="font-size:12px; color:var(--muted); margin:0;">{{ act.type }}</p>
            </div>
            <span style="font-family:'DM Mono',monospace; font-size:16px; font-weight:500; color:var(--accent);">
              {{ act.distance_km }} km
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Add bike modal -->
    <div v-if="showAddModal"
      style="position:fixed; inset:0; background:rgba(16,24,40,0.5); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; z-index:50; padding:24px;"
      @click.self="showAddModal = false">
      <div class="card fade-up" style="width:100%; max-width:420px; padding:28px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px;">
          <h2 style="font-family:'Syne',sans-serif; font-weight:700; font-size:22px; color:var(--text); margin:0;">Nouveau vélo</h2>
          <button @click="showAddModal = false" style="background:transparent; border:none; color:var(--muted); font-size:22px; cursor:pointer; line-height:1; padding:4px; display:flex; align-items:center;">×</button>
        </div>
        <form @submit.prevent="addBike" style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <label class="lbl">Nom du vélo</label>
            <input v-model="newBike.name" required class="inp" placeholder="Mon Trek Madone" />
          </div>
          <div>
            <label class="lbl">Type</label>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <label v-for="t in ['route','vtt','ville','gravel']" :key="t"
                style="display:flex; align-items:center; justify-content:center; padding:10px 12px; border-radius:8px; cursor:pointer; border:1px solid; transition:all 0.15s; font-size:13px; font-weight:500;"
                :style="{ borderColor: newBike.type === t ? 'var(--accent)' : 'var(--border-med)', background: newBike.type === t ? 'var(--accent-dim)' : 'var(--white)', color: newBike.type === t ? 'var(--accent)' : 'var(--muted)' }">
                <input type="radio" v-model="newBike.type" :value="t" style="display:none;" />
                {{ t.charAt(0).toUpperCase() + t.slice(1) }}
              </label>
            </div>
          </div>
          <div>
            <label class="lbl">Kilométrage initial</label>
            <input v-model.number="newBike.initial_km" type="number" min="0" class="inp" placeholder="0" />
          </div>
          <div style="display:flex; gap:10px; margin-top:4px;">
            <button type="button" @click="showAddModal = false" class="btn-secondary" style="flex:1;">Annuler</button>
            <button type="submit" :disabled="addLoading" class="btn-primary" style="flex:2;">
              {{ addLoading ? 'Création…' : 'Créer le vélo' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>
