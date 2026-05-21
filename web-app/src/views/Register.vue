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
  <div class="speed-bg" style="min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; position:relative; overflow:hidden;">

    <div style="position:absolute; top:-100px; right:-60px; width:350px; height:350px; background:radial-gradient(circle, rgba(203,255,0,0.06) 0%, transparent 70%); pointer-events:none;"></div>

    <div style="width:100%; max-width:420px; animation: slideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;">

      <div style="margin-bottom:36px;">
        <router-link to="/login" style="display:inline-flex; align-items:center; gap:6px; font-size:13px; color:var(--muted); text-decoration:none; margin-bottom:28px; transition:color 0.2s;"
          @mouseover="$event.target.style.color='var(--accent)'" @mouseleave="$event.target.style.color='var(--muted)'">
          ← Retour
        </router-link>
        <h1 style="font-family:'Bebas Neue',sans-serif; font-size:48px; letter-spacing:0.04em; color:var(--text); margin:0 0 6px; line-height:1;">Créer un compte</h1>
        <p style="font-size:14px; color:var(--muted); margin:0;">Rejoignez Vélométrix</p>
      </div>

      <form @submit.prevent="submit" style="display:flex; flex-direction:column; gap:14px;">
        <div>
          <label class="vm-label">Nom complet</label>
          <input v-model="name" type="text" required class="vm-input" placeholder="Jean Dupont" />
        </div>
        <div>
          <label class="vm-label">Email</label>
          <input v-model="email" type="email" required class="vm-input" placeholder="you@example.com" />
        </div>
        <div>
          <label class="vm-label">Mot de passe</label>
          <input v-model="password" type="password" required minlength="8" class="vm-input" placeholder="Min. 8 caractères" />
        </div>
        <div>
          <label class="vm-label">Confirmer le mot de passe</label>
          <input v-model="password_confirmation" type="password" required class="vm-input" placeholder="••••••••" />
        </div>

        <div v-if="error" style="background:var(--danger-dim); border:1px solid rgba(255,53,53,0.3); border-radius:8px; padding:10px 14px; font-size:13px; color:var(--danger);">
          {{ error }}
        </div>

        <button type="submit" class="vm-btn" style="margin-top:6px;">
          {{ loading ? 'Création...' : 'Créer mon compte' }}
        </button>
      </form>

      <p style="text-align:center; font-size:13px; color:var(--muted); margin-top:24px;">
        Déjà un compte ?
        <router-link to="/login" style="color:var(--accent); font-weight:600; text-decoration:none;">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>
