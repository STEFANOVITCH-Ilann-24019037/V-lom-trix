<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.message || 'Identifiants incorrects.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="speed-bg" style="min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; position:relative; overflow:hidden;">

    <!-- Accent orb -->
    <div style="position:absolute; top:-120px; right:-80px; width:400px; height:400px; background:radial-gradient(circle, rgba(203,255,0,0.07) 0%, transparent 70%); pointer-events:none;"></div>
    <div style="position:absolute; bottom:-100px; left:-60px; width:300px; height:300px; background:radial-gradient(circle, rgba(203,255,0,0.04) 0%, transparent 70%); pointer-events:none;"></div>

    <div style="width:100%; max-width:420px; animation: slideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;">

      <!-- Header -->
      <div style="margin-bottom:40px;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px;">
          <div style="width:36px; height:36px; background:var(--accent); border-radius:7px; display:flex; align-items:center; justify-content:center;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#06060a">
              <path d="M5 20.5A3.5 3.5 0 0 1 1.5 17A3.5 3.5 0 0 1 5 13.5A3.5 3.5 0 0 1 8.5 17A3.5 3.5 0 0 1 5 20.5M5 12a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m9.8-2H19V8.2h-3l-1.8-3.4c-.3-.6-1-.9-1.5-.9s-1.1.2-1.4.8L9.7 8c-.3.5-.3 1.3.2 1.7l4.3 4.3V19h2v-5.5l-2.5-2.5l1.1-2m-1.8 0M19 20.5A3.5 3.5 0 0 1 15.5 17A3.5 3.5 0 0 1 19 13.5A3.5 3.5 0 0 1 22.5 17A3.5 3.5 0 0 1 19 20.5M19 12a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m-1-9.7c.8 0 1.5.7 1.5 1.5S18.8 5.3 18 5.3S16.5 4.6 16.5 3.8S17.2 2.3 18 2.3z"/>
            </svg>
          </div>
          <span style="font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:0.1em; color:var(--text);">Vélométrix</span>
        </div>
        <h1 style="font-family:'Bebas Neue',sans-serif; font-size:48px; letter-spacing:0.04em; color:var(--text); margin:0 0 6px; line-height:1;">Connexion</h1>
        <p style="font-size:14px; color:var(--muted); margin:0;">Maintenance prédictive pour votre vélo</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submit" style="display:flex; flex-direction:column; gap:16px;">
        <div>
          <label class="vm-label">Email</label>
          <input v-model="email" type="email" required class="vm-input" placeholder="you@example.com" autocomplete="email" />
        </div>
        <div>
          <label class="vm-label">Mot de passe</label>
          <input v-model="password" type="password" required class="vm-input" placeholder="••••••••" autocomplete="current-password" />
        </div>

        <div v-if="error" style="background:var(--danger-dim); border:1px solid rgba(255,53,53,0.3); border-radius:8px; padding:10px 14px; font-size:13px; color:var(--danger);">
          {{ error }}
        </div>

        <button type="submit" class="vm-btn" style="margin-top:4px;">
          {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
        </button>
      </form>

      <p style="text-align:center; font-size:13px; color:var(--muted); margin-top:24px;">
        Pas encore de compte ?
        <router-link to="/register" style="color:var(--accent); font-weight:600; text-decoration:none;">S'inscrire</router-link>
      </p>
    </div>
  </div>
</template>
