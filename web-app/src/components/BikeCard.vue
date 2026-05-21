<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  bike: { type: Object, required: true },
})

const emit = defineEmits(['delete'])
const router = useRouter()

const wearColor = computed(() => {
  if (props.bike.wear_percentage >= 90) return 'text-danger'
  if (props.bike.wear_percentage >= 70) return 'text-warning'
  return 'text-success'
})

const typeLabel = { route: 'Route', vtt: 'VTT', ville: 'Ville', gravel: 'Gravel' }
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
    @click="router.push(`/bike/${bike.id}`)"
  >
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="font-semibold text-lg text-gray-900">{{ bike.name }}</h3>
        <span class="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{{ typeLabel[bike.type] }}</span>
      </div>
      <span class="text-2xl">🚴</span>
    </div>
    <div class="space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Kilométrage</span>
        <span class="font-medium">{{ bike.current_km.toLocaleString() }} km</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Usure moyenne</span>
        <span :class="[wearColor, 'font-bold']">{{ bike.wear_percentage }}%</span>
      </div>
      <div v-if="bike.critical_parts > 0" class="mt-3 flex items-center gap-1 text-xs text-danger font-medium">
        <span>⚠</span> {{ bike.critical_parts }} pièce(s) à remplacer
      </div>
    </div>
  </div>
</template>
