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
const isCritical = computed(() => pct.value >= 90)

const badgeClass = computed(() => {
  if (pct.value >= 90) return 'badge badge-red'
  if (pct.value >= 70) return 'badge badge-orange'
  return 'badge badge-green'
})

async function changePart() {
  if (!confirm(`Confirmer le remplacement de "${props.part.name}" ?`)) return
  await api.post(`/parts/${props.part.id}/change`)
  emit('changed')
}
</script>

<template>
  <div class="card" style="padding:16px;"
    :style="{ borderColor: isCritical ? 'var(--danger-bdr)' : '' }">

    <!-- Header -->
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
      <span style="font-size:13px; font-weight:600; color:var(--text);">{{ part.name }}</span>
      <div style="display:flex; align-items:center; gap:8px;">
        <span :class="badgeClass">{{ pct }}%</span>
        <button v-if="pct >= 70" @click="changePart" class="btn-danger" style="padding:4px 10px; font-size:11px; border-radius:5px;">
          Changer
        </button>
      </div>
    </div>

    <!-- Bar -->
    <div style="height:5px; border-radius:3px; overflow:hidden; background:var(--border); margin-bottom:8px;">
      <div class="bar-fill" :style="{ width: `${pct}%`, height:'5px', background: wearColor, borderRadius:'3px' }"></div>
    </div>

    <!-- Footer -->
    <div style="font-family:'DM Mono',monospace; font-size:11px; color:var(--muted);">
      {{ part.remaining_km.toLocaleString() }} km restants
    </div>
  </div>
</template>
