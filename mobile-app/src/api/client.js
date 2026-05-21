import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Mobile-App': 'true',
  },
})

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('token')
    }
    return Promise.reject(error)
  }
)

export default api
