<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({ bike: { type: Object, required: true } })
const router = useRouter()

const typeLabel = { route: 'Route', vtt: 'VTT', ville: 'Ville', gravel: 'Gravel' }
const typeIcon  = { route: '🚴', vtt: '🚵', ville: '🏙️', gravel: '🌾' }

const wearColor = computed(() => {
  if (props.bike.wear_percentage >= 90) return 'var(--danger)'
  if (props.bike.wear_percentage >= 70) return 'var(--warning)'
  return 'var(--success)'
})
</script>

<template>
  <div class="card" style="padding:22px; cursor:pointer;" @click="router.push(`/bike/${bike.id}`)">

    <!-- Top row -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:18px;">
      <div>
        <span class="badge badge-gray" style="margin-bottom:8px; font-size:11px; letter-spacing:0.06em;">{{ typeLabel[bike.type] }}</span>
        <h3 style="font-family:'Syne',sans-serif; font-weight:700; font-size:18px; color:var(--text); margin:0; line-height:1.2;">
          {{ bike.name }}
        </h3>
      </div>
      <span style="font-size:26px; line-height:1; margin-top:2px;">{{ typeIcon[bike.type] }}</span>
    </div>

    <!-- Stats row -->
    <div style="display:flex; gap:20px; margin-bottom:16px;">
      <div>
        <div style="font-size:11px; font-weight:500; color:var(--muted); margin-bottom:3px;">Kilométrage</div>
        <div style="font-family:'DM Mono',monospace; font-size:20px; font-weight:500; color:var(--text);">
          {{ bike.current_km.toLocaleString() }}<span style="font-size:12px; color:var(--muted); margin-left:2px;">km</span>
        </div>
      </div>
      <div style="width:1px; background:var(--border);"></div>
      <div>
        <div style="font-size:11px; font-weight:500; color:var(--muted); margin-bottom:3px;">Usure moy.</div>
        <div style="font-family:'DM Mono',monospace; font-size:20px; font-weight:500;" :style="{ color: wearColor }">
          {{ bike.wear_percentage }}<span style="font-size:12px; margin-left:1px;">%</span>
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div style="height:5px; background:var(--border); border-radius:3px; overflow:hidden;">
      <div class="bar-fill" :style="{ width: `${bike.wear_percentage}%`, height:'5px', background: wearColor, borderRadius:'3px' }"></div>
    </div>

    <!-- Alert -->
    <div v-if="bike.critical_parts > 0"
      style="margin-top:12px; display:flex; align-items:center; gap:6px; font-size:12px; font-weight:500; padding:7px 10px; border-radius:7px;"
      :style="{ background: 'var(--danger-dim)', border: '1px solid var(--danger-bdr)', color: 'var(--danger)' }">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22M12 8v7m0 3h.01"/><path d="M12 8v6m0 2v.01" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
      {{ bike.critical_parts }} pièce{{ bike.critical_parts > 1 ? 's' : '' }} à remplacer
    </div>
  </div>
</template>
