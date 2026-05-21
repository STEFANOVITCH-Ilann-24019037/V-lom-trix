<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({ bike: { type: Object, required: true } })
const router = useRouter()

const typeLabel = { route: 'ROUTE', vtt: 'VTT', ville: 'VILLE', gravel: 'GRAVEL' }
const typeIcon  = { route: '🚴', vtt: '🚵', ville: '🏙️', gravel: '🌾' }

const wearColor = computed(() => {
  if (props.bike.wear_percentage >= 90) return 'var(--danger)'
  if (props.bike.wear_percentage >= 70) return 'var(--warning)'
  return 'var(--success)'
})

const wearBg = computed(() => {
  if (props.bike.wear_percentage >= 90) return 'var(--danger-dim)'
  if (props.bike.wear_percentage >= 70) return 'var(--warning-dim)'
  return 'var(--success-dim)'
})
</script>

<template>
  <div class="vm-card" style="padding:22px; cursor:pointer;" @click="router.push(`/bike/${bike.id}`)">

    <!-- Top row -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
      <div>
        <div style="font-size:10px; font-weight:700; letter-spacing:0.15em; color:var(--muted); margin-bottom:5px; font-family:'Outfit',sans-serif;">
          {{ typeLabel[bike.type] }}
        </div>
        <h3 style="font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:0.05em; color:var(--text); margin:0; line-height:1.1;">
          {{ bike.name }}
        </h3>
      </div>
      <span style="font-size:24px; line-height:1;">{{ typeIcon[bike.type] }}</span>
    </div>

    <!-- Stats row -->
    <div style="display:flex; gap:16px; margin-bottom:20px;">
      <div>
        <div style="font-size:10px; font-weight:700; letter-spacing:0.12em; color:var(--muted); margin-bottom:2px;">KM TOTAL</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:700; color:var(--text);">
          {{ bike.current_km.toLocaleString() }}
        </div>
      </div>
      <div style="width:1px; background:var(--border);"></div>
      <div>
        <div style="font-size:10px; font-weight:700; letter-spacing:0.12em; color:var(--muted); margin-bottom:2px;">USURE MOY.</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:700;" :style="{ color: wearColor }">
          {{ bike.wear_percentage }}<span style="font-size:13px; font-weight:400;">%</span>
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div style="height:4px; background:var(--border); border-radius:2px; overflow:hidden;">
      <div class="bar-animate" :style="{ width: `${bike.wear_percentage}%`, height:'4px', background: wearColor, borderRadius:'2px', boxShadow: bike.wear_percentage >= 90 ? `0 0 8px ${wearColor}` : 'none' }"></div>
    </div>

    <!-- Alert -->
    <div v-if="bike.critical_parts > 0" style="margin-top:14px; display:flex; align-items:center; gap:6px; font-size:12px; font-weight:600; padding:7px 10px; border-radius:6px; background:var(--danger-dim); border:1px solid rgba(255,53,53,0.2);" :style="{ color: 'var(--danger)' }">
      <span>⚠</span> {{ bike.critical_parts }} pièce{{ bike.critical_parts > 1 ? 's' : '' }} à remplacer
    </div>
  </div>
</template>
