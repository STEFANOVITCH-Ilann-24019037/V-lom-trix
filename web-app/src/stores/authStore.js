import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/client'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  async function login(email, password) {
    const { data } = await api.post('/login', { email, password })
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  async function register(name, email, password, password_confirmation) {
    const { data } = await api.post('/register', { name, email, password, password_confirmation })
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  async function logout() {
    await api.post('/logout').catch(() => {})
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  async function fetchUser() {
    if (!token.value) return
    const { data } = await api.get('/user')
    user.value = data
  }

  const isAuthenticated = () => !!token.value

  return { user, token, login, register, logout, fetchUser, isAuthenticated }
})
