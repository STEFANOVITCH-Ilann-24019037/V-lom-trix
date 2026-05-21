import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import api from '../api/client'

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: true,

  init: async () => {
    const token = await SecureStore.getItemAsync('token')
    if (token) {
      set({ token })
      try {
        const { data } = await api.get('/user')
        set({ user: data, isLoading: false })
      } catch {
        await SecureStore.deleteItemAsync('token')
        set({ token: null, isLoading: false })
      }
    } else {
      set({ isLoading: false })
    }
  },

  login: async (email, password) => {
    const { data } = await api.post('/login', { email, password })
    await SecureStore.setItemAsync('token', data.token)
    set({ user: data.user, token: data.token })
  },

  register: async (name, email, password, passwordConfirmation) => {
    const { data } = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    })
    await SecureStore.setItemAsync('token', data.token)
    set({ user: data.user, token: data.token })
  },

  logout: async () => {
    await api.post('/logout').catch(() => {})
    await SecureStore.deleteItemAsync('token')
    set({ user: null, token: null })
  },
}))
