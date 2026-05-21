import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/client'

export const useBikeStore = defineStore('bikes', () => {
  const bikes = ref([])
  const currentBike = ref(null)
  const loading = ref(false)

  async function fetchBikes() {
    loading.value = true
    const { data } = await api.get('/bikes')
    bikes.value = data
    loading.value = false
  }

  async function fetchBike(id) {
    loading.value = true
    const { data } = await api.get(`/bikes/${id}`)
    currentBike.value = data
    loading.value = false
    return data
  }

  async function createBike(payload) {
    const { data } = await api.post('/bikes', payload)
    bikes.value.push(data)
    return data
  }

  async function deleteBike(id) {
    await api.delete(`/bikes/${id}`)
    bikes.value = bikes.value.filter((b) => b.id !== id)
  }

  async function changePart(partId) {
    const { data } = await api.post(`/parts/${partId}/change`)
    return data
  }

  return { bikes, currentBike, loading, fetchBikes, fetchBike, createBike, deleteBike, changePart }
})
