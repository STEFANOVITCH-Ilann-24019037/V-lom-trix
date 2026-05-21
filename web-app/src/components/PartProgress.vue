<script setup>
import { computed } from 'vue'
import api from '../api/client'

const props = defineProps({
  part: { type: Object, required: true },
})

const emit = defineEmits(['changed'])

const barColor = computed(() => {
  if (props.part.wear_percentage >= 90) return 'bg-danger'
  if (props.part.wear_percentage >= 70) return 'bg-warning'
  return 'bg-success'
})

const textColor = computed(() => {
  if (props.part.wear_percentage >= 90) return 'text-danger'
  if (props.part.wear_percentage >= 70) return 'text-warning'
  return 'text-success'
})

async function changePart() {
  if (!confirm(`Confirmer le remplacement de "${props.part.name}" ?`)) return
  await api.post(`/parts/${props.part.id}/change`)
  emit('changed')
}
</script>

<template>
  <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
    <div class="flex items-center justify-between mb-2">
      <span class="font-medium text-gray-800">{{ part.name }}</span>
      <span :class="[textColor, 'font-bold text-sm']">{{ part.wear_percentage }}%</span>
    </div>
    <div class="w-full bg-gray-100 rounded-full h-3 mb-2">
      <div
        :class="[barColor, 'h-3 rounded-full transition-all duration-500']"
        :style="{ width: `${part.wear_percentage}%` }"
      ></div>
    </div>
    <div class="flex items-center justify-between">
      <span class="text-xs text-gray-500">{{ part.remaining_km }} km restants</span>
      <button
        v-if="part.wear_percentage >= 70"
        @click="changePart"
        class="text-xs bg-primary text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Changer
      </button>
    </div>
  </div>
</template>
