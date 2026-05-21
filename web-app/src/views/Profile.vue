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
  <div style="max-width:600px; margin:0 auto; padding:32px 24px;">

    <p style="font-size:11px; font-weight:700; letter-spacing:0.15em; color:var(--muted); margin:0 0 4px; font-family:'Outfit',sans-serif;">MON COMPTE</p>
    <h1 style="font-family:'Bebas Neue',sans-serif; font-size:42px; letter-spacing:0.04em; color:var(--text); margin:0 0 28px; line-height:1;">Profil</h1>

    <!-- Profile card -->
    <div style="background:var(--card); border:1px solid var(--border); border-radius:16px; padding:28px; margin-bottom:16px; position:relative; overflow:hidden;">
      <div style="position:absolute; right:-30px; top:-30px; width:150px; height:150px; background:radial-gradient(circle, var(--accent-dim) 0%, transparent 70%); pointer-events:none;"></div>

      <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px; position:relative;">
        <div style="width:56px; height:56px; background:var(--accent); border-radius:12px; display:flex; align-items:center; justify-content:center; font-family:'Bebas Neue',sans-serif; font-size:28px; color:#06060a; flex-shrink:0;">
          {{ initial() }}
        </div>
        <div>
          <p style="font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:0.05em; color:var(--text); margin:0 0 2px;">{{ auth.user?.name }}</p>
          <p style="font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--muted); margin:0;">{{ auth.user?.email }}</p>
        </div>
      </div>

      <div style="border-top:1px solid var(--border); padding-top:20px; display:flex; align-items:center; justify-content:space-between;">
        <div>
          <div style="font-size:10px; font-weight:700; letter-spacing:0.15em; color:var(--muted); margin-bottom:4px; font-family:'Outfit',sans-serif;">STRAVA</div>
          <div v-if="auth.user?.strava_connected" style="display:flex; align-items:center; gap:6px; font-size:13px; font-weight:600; color:var(--success);">
            <span style="width:7px; height:7px; background:var(--success); border-radius:50%; display:inline-block;"></span> Connecté
          </div>
          <div v-else style="font-size:13px; color:var(--muted);">Non connecté</div>
        </div>
      </div>
    </div>

    <!-- Logout -->
    <button @click="logout"
      style="width:100%; padding:13px; border-radius:10px; border:1px solid rgba(255,53,53,0.3); background:var(--danger-dim); color:var(--danger); font-family:'Outfit',sans-serif; font-weight:700; font-size:14px; letter-spacing:0.04em; cursor:pointer; transition:all 0.2s;"
      @mouseover="$event.currentTarget.style.background='rgba(255,53,53,0.2)'"
      @mouseleave="$event.currentTarget.style.background='var(--danger-dim)'">
      SE DÉCONNECTER
    </button>
  </div>
</template>
