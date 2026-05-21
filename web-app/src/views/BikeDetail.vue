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

const typeLabel = { route: 'ROUTE', vtt: 'VTT', ville: 'VILLE', gravel: 'GRAVEL' }
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
  <div style="max-width:900px; margin:0 auto; padding:32px 24px;">

    <!-- Back -->
    <button @click="router.push('/dashboard')"
      style="display:inline-flex; align-items:center; gap:6px; font-size:13px; color:var(--muted); background:transparent; border:none; cursor:pointer; margin-bottom:28px; font-family:'Outfit',sans-serif; transition:color 0.2s; padding:0;"
      @mouseover="$event.target.style.color='var(--accent)'" @mouseleave="$event.target.style.color='var(--muted)'">
      ← Retour
    </button>

    <LoadingSpinner v-if="loading" />

    <template v-else-if="bike">

      <!-- Hero header -->
      <div style="background:var(--card); border:1px solid var(--border); border-radius:16px; padding:28px; margin-bottom:24px; position:relative; overflow:hidden;">
        <!-- Subtle accent bg -->
        <div style="position:absolute; right:-40px; top:-40px; width:200px; height:200px; background:radial-gradient(circle, var(--accent-dim) 0%, transparent 70%); pointer-events:none;"></div>

        <div style="display:flex; align-items:flex-start; justify-content:space-between; position:relative;">
          <div>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
              <span style="font-size:11px; font-weight:700; letter-spacing:0.15em; color:var(--muted); font-family:'Outfit',sans-serif;">{{ typeLabel[bike.type] }}</span>
              <span>{{ typeIcon[bike.type] }}</span>
            </div>
            <h1 style="font-family:'Bebas Neue',sans-serif; font-size:40px; letter-spacing:0.04em; color:var(--text); margin:0 0 20px; line-height:1;">{{ bike.name }}</h1>

            <!-- Stats -->
            <div style="display:flex; gap:24px;">
              <div>
                <div style="font-size:10px; font-weight:700; letter-spacing:0.15em; color:var(--muted); margin-bottom:4px;">KILOMÉTRAGE</div>
                <div style="font-family:'JetBrains Mono',monospace; font-size:28px; font-weight:700; color:var(--text);">
                  {{ bike.current_km.toLocaleString() }}<span style="font-size:14px; color:var(--muted); margin-left:2px;">km</span>
                </div>
              </div>
              <div style="width:1px; background:var(--border);"></div>
              <div>
                <div style="font-size:10px; font-weight:700; letter-spacing:0.15em; color:var(--muted); margin-bottom:4px;">USURE MOY.</div>
                <div style="font-family:'JetBrains Mono',monospace; font-size:28px; font-weight:700;" :style="{ color: wearColor }">
                  {{ avgWear }}<span style="font-size:14px; margin-left:2px;">%</span>
                </div>
              </div>
            </div>
          </div>

          <button @click="handleDelete"
            style="font-size:12px; font-weight:600; padding:8px 14px; border-radius:7px; border:1px solid rgba(255,53,53,0.3); color:var(--danger); background:var(--danger-dim); cursor:pointer; font-family:'Outfit',sans-serif; transition:all 0.2s; letter-spacing:0.04em;">
            SUPPRIMER
          </button>
        </div>

        <!-- Overall progress bar -->
        <div style="height:6px; background:var(--border); border-radius:3px; margin-top:20px; overflow:hidden;">
          <div class="bar-animate" :style="{ width:`${avgWear}%`, height:'6px', background: wearColor, borderRadius:'3px' }"></div>
        </div>
      </div>

      <!-- Parts -->
      <p style="font-size:11px; font-weight:700; letter-spacing:0.15em; color:var(--muted); margin:0 0 12px; font-family:'Outfit',sans-serif;">COMPOSANTS</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:12px;">
        <div v-for="(part, i) in bike.parts" :key="part.id" class="slide-up" :style="{ animationDelay: `${i * 0.06}s` }">
          <PartProgress :part="part" @changed="load" />
        </div>
      </div>

    </template>
  </div>
</template>
