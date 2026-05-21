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
  <div style="max-width:1200px; margin:0 auto; padding:32px 24px;">

    <!-- Header -->
    <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:32px; flex-wrap:wrap; gap:16px;">
      <div>
        <p style="font-size:11px; font-weight:700; letter-spacing:0.15em; color:var(--muted); margin:0 0 4px; font-family:'Outfit',sans-serif;">TABLEAU DE BORD</p>
        <h1 style="font-family:'Bebas Neue',sans-serif; font-size:42px; letter-spacing:0.04em; color:var(--text); margin:0; line-height:1;">
          Bonjour, {{ auth.user?.name?.split(' ')[0] }}
        </h1>
        <p v-if="dashboard" style="font-size:13px; color:var(--muted); margin:6px 0 0; font-family:'JetBrains Mono',monospace;">
          {{ dashboard.stats.nb_bikes }} vélo{{ dashboard.stats.nb_bikes > 1 ? 's' : '' }} · {{ dashboard.stats.total_km.toLocaleString() }} km total
        </p>
      </div>
      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <StravaConnectButton v-if="dashboard && !dashboard.strava_connected" />
        <button v-if="dashboard?.strava_connected" @click="sync" :disabled="syncing"
          style="display:flex; align-items:center; gap:8px; background:transparent; border:1px solid #FC4C02; color:#FC4C02; font-family:'Outfit',sans-serif; font-weight:600; font-size:13px; padding:9px 18px; border-radius:8px; cursor:pointer; transition:all 0.2s;"
          :style="{ opacity: syncing ? 0.6 : 1 }">
          <svg v-if="!syncing" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
          {{ syncing ? 'Synchro...' : 'Synchroniser Strava' }}
        </button>
        <button @click="showAddModal = true"
          style="display:flex; align-items:center; gap:6px; background:var(--accent); color:#06060a; font-family:'Outfit',sans-serif; font-weight:700; font-size:13px; letter-spacing:0.03em; padding:10px 20px; border-radius:8px; border:none; cursor:pointer; transition:opacity 0.2s;"
          @mouseover="$event.target.style.opacity='0.85'" @mouseleave="$event.target.style.opacity='1'">
          + Ajouter un vélo
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <template v-else-if="dashboard">

      <!-- Empty state -->
      <div v-if="dashboard.bikes.length === 0"
        style="text-align:center; padding:80px 20px; border:1px dashed var(--border); border-radius:16px;">
        <div style="font-size:56px; margin-bottom:16px;">🚴</div>
        <p style="font-family:'Bebas Neue',sans-serif; font-size:28px; color:var(--text); letter-spacing:0.05em; margin:0 0 8px;">Aucun vélo</p>
        <p style="color:var(--muted); font-size:14px; margin:0 0 20px;">Ajoutez votre premier vélo pour commencer le suivi</p>
        <button @click="showAddModal = true" class="vm-btn" style="width:auto; padding:11px 28px;">
          + Ajouter un vélo
        </button>
      </div>

      <!-- Bikes grid -->
      <div v-else style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:16px; margin-bottom:40px;">
        <div v-for="(bike, i) in dashboard.bikes" :key="bike.id" class="slide-up" :style="{ animationDelay: `${i * 0.08}s` }">
          <BikeCard :bike="bike" />
        </div>
      </div>

      <!-- Strava activities -->
      <div v-if="dashboard.last_activities?.length > 0">
        <p style="font-size:11px; font-weight:700; letter-spacing:0.15em; color:var(--muted); margin:0 0 12px; font-family:'Outfit',sans-serif;">DERNIÈRES ACTIVITÉS STRAVA</p>
        <div style="background:var(--card); border:1px solid var(--border); border-radius:12px; overflow:hidden;">
          <div v-for="(act, i) in dashboard.last_activities" :key="act.id"
            :style="{ borderTop: i > 0 ? '1px solid var(--border)' : 'none', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px' }">
            <div>
              <p style="font-size:14px; font-weight:600; color:var(--text); margin:0 0 2px;">{{ act.name }}</p>
              <p style="font-size:12px; color:var(--muted); margin:0;">{{ act.type }}</p>
            </div>
            <span style="font-family:'JetBrains Mono',monospace; font-size:16px; font-weight:700; color:var(--accent);">
              {{ act.distance_km }} km
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Add bike modal -->
    <div v-if="showAddModal"
      style="position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:50; padding:24px;"
      @click.self="showAddModal = false">
      <div style="background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:28px; width:100%; max-width:420px; animation:slideUp 0.35s cubic-bezier(0.22,1,0.36,1) both;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px;">
          <h2 style="font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:0.05em; color:var(--text); margin:0;">Nouveau vélo</h2>
          <button @click="showAddModal = false" style="background:transparent; border:none; color:var(--muted); font-size:22px; cursor:pointer; line-height:1; padding:4px;">×</button>
        </div>
        <form @submit.prevent="addBike" style="display:flex; flex-direction:column; gap:14px;">
          <div>
            <label class="vm-label">Nom</label>
            <input v-model="newBike.name" required class="vm-input" placeholder="Mon Trek Madone" />
          </div>
          <div>
            <label class="vm-label">Type</label>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <label v-for="t in ['route','vtt','ville','gravel']" :key="t"
                style="display:flex; align-items:center; gap:8px; padding:10px 12px; border-radius:8px; cursor:pointer; border:1px solid; transition:all 0.2s; font-size:13px; font-weight:500;"
                :style="{ borderColor: newBike.type === t ? 'var(--accent)' : 'var(--border)', background: newBike.type === t ? 'var(--accent-dim)' : 'var(--card)', color: newBike.type === t ? 'var(--accent)' : 'var(--muted)' }">
                <input type="radio" v-model="newBike.type" :value="t" style="display:none;" />
                {{ t.charAt(0).toUpperCase() + t.slice(1) }}
              </label>
            </div>
          </div>
          <div>
            <label class="vm-label">Kilométrage initial</label>
            <input v-model.number="newBike.initial_km" type="number" min="0" class="vm-input" placeholder="0" />
          </div>
          <div style="display:flex; gap:10px; margin-top:4px;">
            <button type="button" @click="showAddModal = false" class="vm-btn-ghost" style="flex:1; padding:12px;">Annuler</button>
            <button type="submit" :disabled="addLoading" class="vm-btn" style="flex:2;">
              {{ addLoading ? 'Création...' : 'Créer le vélo' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>
