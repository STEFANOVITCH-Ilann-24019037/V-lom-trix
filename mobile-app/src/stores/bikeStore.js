import { create } from 'zustand'
import api from '../api/client'

export const useBikeStore = create((set) => ({
  bikes: [],
  currentBike: null,
  loading: false,

  fetchDashboard: async () => {
    set({ loading: true })
    const { data } = await api.get('/mobile/dashboard')
    set({ bikes: data.bikes, loading: false })
    return data
  },

  fetchBike: async (id) => {
    set({ loading: true })
    const { data } = await api.get(`/bikes/${id}`)
    set({ currentBike: data, loading: false })
    return data
  },

  createBike: async (payload) => {
    const { data } = await api.post('/bikes', payload)
    set((state) => ({ bikes: [...state.bikes, data] }))
    return data
  },

  changePart: async (partId) => {
    const { data } = await api.post(`/parts/${partId}/change`)
    return data
  },
}))
