<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.register(name.value, email.value, password.value, password_confirmation.value)
    router.push('/dashboard')
  } catch (e) {
    const errors = e.response?.data?.errors
    error.value = errors ? Object.values(errors).flat().join(' ') : "Erreur lors de l'inscription."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div style="min-height:100vh; background:var(--bg); display:grid; place-items:center; padding:24px;">
    <div style="width:100%; max-width:400px;" class="fade-up">

      <!-- Logo -->
      <div style="text-align:center; margin-bottom:36px;">
        <div style="width:48px; height:48px; background:var(--accent); border-radius:12px; display:flex; align-items:center; justify-content:center; margin:0 auto 14px;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M5 20.5A3.5 3.5 0 0 1 1.5 17A3.5 3.5 0 0 1 5 13.5A3.5 3.5 0 0 1 8.5 17A3.5 3.5 0 0 1 5 20.5M5 12a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m9.8-2H19V8.2h-3l-1.8-3.4c-.3-.6-1-.9-1.5-.9s-1.1.2-1.4.8L9.7 8c-.3.5-.3 1.3.2 1.7l4.3 4.3V19h2v-5.5l-2.5-2.5l1.1-2m-1.8 0M19 20.5A3.5 3.5 0 0 1 15.5 17A3.5 3.5 0 0 1 19 13.5A3.5 3.5 0 0 1 22.5 17A3.5 3.5 0 0 1 19 20.5M19 12a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m-1-9.7c.8 0 1.5.7 1.5 1.5S18.8 5.3 18 5.3S16.5 4.6 16.5 3.8S17.2 2.3 18 2.3z"/></svg>
        </div>
        <h1 style="font-family:'Syne',sans-serif; font-weight:700; font-size:26px; color:var(--text); letter-spacing:-0.02em; margin-bottom:6px;">Créer un compte</h1>
        <p style="font-size:14px; color:var(--muted);">Rejoignez Vélométrix</p>
      </div>

      <!-- Card -->
      <div class="card" style="padding:28px;">
        <form @submit.prevent="submit" style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <label class="lbl">Nom complet</label>
            <input v-model="name" type="text" required class="inp" placeholder="Jean Dupont" />
          </div>
          <div>
            <label class="lbl">Adresse e-mail</label>
            <input v-model="email" type="email" required class="inp" placeholder="nom@exemple.com" />
          </div>
          <div>
            <label class="lbl">Mot de passe</label>
            <input v-model="password" type="password" required minlength="8" class="inp" placeholder="Min. 8 caractères" />
          </div>
          <div>
            <label class="lbl">Confirmer le mot de passe</label>
            <input v-model="password_confirmation" type="password" required class="inp" placeholder="••••••••" />
          </div>

          <div v-if="error" style="padding:10px 14px; background:var(--danger-dim); border:1px solid var(--danger-bdr); border-radius:8px; color:var(--danger); font-size:13px;">
            {{ error }}
          </div>

          <button type="submit" class="btn-primary" :disabled="loading" style="width:100%; padding:11px 18px; font-size:15px; margin-top:2px;">
            {{ loading ? 'Création…' : 'Créer mon compte' }}
          </button>
        </form>
      </div>

      <p style="text-align:center; font-size:13px; color:var(--muted); margin-top:20px;">
        Déjà un compte ?
        <router-link to="/login" style="color:var(--accent); font-weight:600; text-decoration:none;">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>
