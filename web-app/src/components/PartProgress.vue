<script setup>
import { computed } from 'vue'
import api from '../api/client'

const props = defineProps({ part: { type: Object, required: true } })
const emit = defineEmits(['changed'])

const pct = computed(() => props.part.wear_percentage)
const wearColor = computed(() => {
  if (pct.value >= 90) return 'var(--danger)'
  if (pct.value >= 70) return 'var(--warning)'
  return 'var(--success)'
})
const wearBg = computed(() => {
  if (pct.value >= 90) return 'var(--danger-dim)'
  if (pct.value >= 70) return 'var(--warning-dim)'
  return 'var(--success-dim)'
})
const isCritical = computed(() => pct.value >= 90)

async function changePart() {
  if (!confirm(`Confirmer le remplacement de "${props.part.name}" ?`)) return
  await api.post(`/parts/${props.part.id}/change`)
  emit('changed')
}
</script>

<template>
  <div style="background:var(--card); border:1px solid var(--border); border-radius:10px; padding:16px; transition:border-color 0.2s;"
    :style="{ borderColor: isCritical ? 'rgba(255,53,53,0.3)' : 'var(--border)' }">

    <!-- Header -->
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
      <span style="font-size:13px; font-weight:600; color:var(--text);">{{ part.name }}</span>
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:700;" :style="{ color: wearColor }">
          {{ pct }}%
        </span>
        <button v-if="pct >= 70" @click="changePart"
          style="font-size:11px; font-weight:700; letter-spacing:0.05em; padding:4px 10px; border-radius:5px; border:none; cursor:pointer; font-family:'Outfit',sans-serif; transition:opacity 0.2s;"
          :style="{ background: wearColor, color: pct >= 90 ? '#fff' : '#06060a' }">
          CHANGER
        </button>
      </div>
    </div>

    <!-- Bar -->
    <div style="height:6px; border-radius:3px; overflow:hidden; background:var(--border); margin-bottom:8px;">
      <div class="bar-animate"
        :class="{ 'glow-danger': isCritical }"
        :style="{ width: `${pct}%`, height:'6px', background: wearColor, borderRadius:'3px' }">
      </div>
    </div>

    <!-- Footer -->
    <div style="font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted);">
      {{ part.remaining_km.toLocaleString() }} km restants
    </div>
  </div>
</template>
