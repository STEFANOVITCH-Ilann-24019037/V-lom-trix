<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

async function logout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <header style="background:#fff; border-bottom:1px solid var(--border); position:sticky; top:0; z-index:40;">
    <div style="max-width:1100px; margin:0 auto; padding:0 24px; height:56px; display:flex; align-items:center; justify-content:space-between;">

      <router-link to="/dashboard" style="text-decoration:none; display:flex; align-items:center; gap:8px;">
        <div style="width:30px; height:30px; background:var(--accent); border-radius:7px; display:flex; align-items:center; justify-content:center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M5 20.5A3.5 3.5 0 0 1 1.5 17A3.5 3.5 0 0 1 5 13.5A3.5 3.5 0 0 1 8.5 17A3.5 3.5 0 0 1 5 20.5M5 12a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m9.8-2H19V8.2h-3l-1.8-3.4c-.3-.6-1-.9-1.5-.9s-1.1.2-1.4.8L9.7 8c-.3.5-.3 1.3.2 1.7l4.3 4.3V19h2v-5.5l-2.5-2.5l1.1-2m-1.8 0M19 20.5A3.5 3.5 0 0 1 15.5 17A3.5 3.5 0 0 1 19 13.5A3.5 3.5 0 0 1 22.5 17A3.5 3.5 0 0 1 19 20.5M19 12a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m-1-9.7c.8 0 1.5.7 1.5 1.5S18.8 5.3 18 5.3S16.5 4.6 16.5 3.8S17.2 2.3 18 2.3z"/></svg>
        </div>
        <span style="font-family:'Syne',sans-serif; font-weight:700; font-size:17px; color:var(--text); letter-spacing:-0.01em;">Vélométrix</span>
      </router-link>

      <nav style="display:flex; align-items:center; gap:4px;">
        <router-link to="/dashboard"
          :style="{ padding:'6px 12px', borderRadius:'7px', fontSize:'13px', fontWeight:'500', textDecoration:'none', background: route.name==='Dashboard' ? 'var(--accent-dim)' : 'transparent', color: route.name==='Dashboard' ? 'var(--accent)' : 'var(--muted)', transition:'all 0.15s' }">
          Dashboard
        </router-link>
        <router-link to="/profile"
          :style="{ padding:'6px 12px', borderRadius:'7px', fontSize:'13px', fontWeight:'500', textDecoration:'none', background: route.name==='Profile' ? 'var(--accent-dim)' : 'transparent', color: route.name==='Profile' ? 'var(--accent)' : 'var(--muted)', transition:'all 0.15s' }">
          Profil
        </router-link>
        <div style="width:1px; height:18px; background:var(--border); margin:0 6px;"></div>
        <button @click="logout" style="padding:6px 12px; border-radius:7px; font-size:13px; font-weight:500; background:transparent; border:none; color:var(--muted); cursor:pointer; font-family:'DM Sans',sans-serif; transition:color 0.15s;"
          @mouseover="$event.target.style.color='var(--danger)'" @mouseleave="$event.target.style.color='var(--muted)'">
          Déconnexion
        </button>
      </nav>
    </div>
  </header>
</template>
