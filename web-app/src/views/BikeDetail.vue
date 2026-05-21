<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/client'
import PartProgress from '../components/PartProgress.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

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
const typeIcon  = { route: '🚴', vtt: '🚵', ville: '🏙️', gravel: '🌾' }

const avgWear = computed(() => bike.value?.wear_percentage ?? 0)
const wearColor = computed(() => {
  if (avgWear.value >= 90) return 'var(--danger)'
  if (avgWear.value >= 70) return 'var(--warning)'
  return 'var(--success)'
})

onMounted(load)
</script>

<template>
  <div style="max-width:900px; margin:0 auto; padding:36px 24px;">

    <!-- Back -->
    <button @click="router.push('/dashboard')"
      style="display:inline-flex; align-items:center; gap:6px; font-size:13px; color:var(--muted); background:transparent; border:none; cursor:pointer; margin-bottom:28px; font-family:'DM Sans',sans-serif; font-weight:500; padding:0; transition:color 0.15s;"
      @mouseover="$event.currentTarget.style.color='var(--accent)'"
      @mouseleave="$event.currentTarget.style.color='var(--muted)'">
      ← Retour au tableau de bord
    </button>

    <LoadingSpinner v-if="loading" />

    <template v-else-if="bike">

      <!-- Hero header -->
      <div class="card fade-up" style="padding:28px; margin-bottom:24px;">
        <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:20px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
              <span class="badge badge-gray">{{ typeLabel[bike.type] }}</span>
              <span>{{ typeIcon[bike.type] }}</span>
            </div>
            <h1 style="font-family:'Syne',sans-serif; font-weight:700; font-size:30px; color:var(--text); margin:0; letter-spacing:-0.02em;">{{ bike.name }}</h1>
          </div>
          <button @click="handleDelete" class="btn-danger">
            Supprimer
          </button>
        </div>

        <!-- Stats -->
        <div style="display:flex; gap:28px; margin-bottom:20px;">
          <div>
            <div style="font-size:11px; font-weight:500; color:var(--muted); margin-bottom:4px; text-transform:uppercase; letter-spacing:0.06em;">Kilométrage</div>
            <div style="font-family:'DM Mono',monospace; font-size:26px; font-weight:500; color:var(--text);">
              {{ bike.current_km.toLocaleString() }}<span style="font-size:14px; color:var(--muted); margin-left:3px;">km</span>
            </div>
          </div>
          <div style="width:1px; background:var(--border);"></div>
          <div>
            <div style="font-size:11px; font-weight:500; color:var(--muted); margin-bottom:4px; text-transform:uppercase; letter-spacing:0.06em;">Usure moyenne</div>
            <div style="font-family:'DM Mono',monospace; font-size:26px; font-weight:500;" :style="{ color: wearColor }">
              {{ avgWear }}<span style="font-size:14px; margin-left:2px;">%</span>
            </div>
          </div>
        </div>

        <!-- Overall progress bar -->
        <div style="height:6px; background:var(--border); border-radius:3px; overflow:hidden;">
          <div class="bar-fill" :style="{ width:`${avgWear}%`, height:'6px', background: wearColor, borderRadius:'3px' }"></div>
        </div>
      </div>

      <!-- Parts -->
      <p style="font-size:12px; font-weight:600; letter-spacing:0.08em; color:var(--muted); margin:0 0 12px; text-transform:uppercase;">Composants</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:12px;">
        <div v-for="(part, i) in bike.parts" :key="part.id" class="fade-up" :style="{ animationDelay: `${i * 0.05}s` }">
          <PartProgress :part="part" @changed="load" />
        </div>
      </div>

    </template>
  </div>
</template>
