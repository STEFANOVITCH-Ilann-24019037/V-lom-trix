<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const router = useRouter()

async function logout() {
  await auth.logout()
  router.push('/login')
}

const initial = () => auth.user?.name?.charAt(0).toUpperCase() ?? '?'
</script>

<template>
  <div style="max-width:560px; margin:0 auto; padding:36px 24px;">

    <p style="font-size:12px; font-weight:600; letter-spacing:0.08em; color:var(--muted); margin:0 0 6px; text-transform:uppercase;">Mon compte</p>
    <h1 style="font-family:'Syne',sans-serif; font-weight:700; font-size:30px; color:var(--text); margin:0 0 28px; letter-spacing:-0.02em;" class="fade-up">Profil</h1>

    <!-- Profile card -->
    <div class="card fade-up" style="padding:28px; margin-bottom:16px;">
      <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
        <div style="width:52px; height:52px; background:var(--accent); border-radius:12px; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:#fff; flex-shrink:0;">
          {{ initial() }}
        </div>
        <div>
          <p style="font-family:'Syne',sans-serif; font-weight:700; font-size:18px; color:var(--text); margin:0 0 3px;">{{ auth.user?.name }}</p>
          <p style="font-family:'DM Mono',monospace; font-size:13px; color:var(--muted); margin:0;">{{ auth.user?.email }}</p>
        </div>
      </div>

      <div style="border-top:1px solid var(--border); padding-top:20px; display:flex; align-items:center; justify-content:space-between;">
        <div>
          <div style="font-size:11px; font-weight:600; letter-spacing:0.08em; color:var(--muted); margin-bottom:6px; text-transform:uppercase;">Strava</div>
          <div v-if="auth.user?.strava_connected" class="badge badge-green">
            <span style="width:6px; height:6px; background:var(--success); border-radius:50%; display:inline-block; margin-right:5px;"></span>
            Connecté
          </div>
          <div v-else style="font-size:13px; color:var(--muted);">Non connecté</div>
        </div>
      </div>
    </div>

    <!-- Logout -->
    <button @click="logout" class="btn-danger" style="width:100%; padding:13px; font-size:14px; border-radius:10px; justify-content:center;">
      Se déconnecter
    </button>
  </div>
</template>
