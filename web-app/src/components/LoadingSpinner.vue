<template>
  <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px; gap:14px;">
    <div style="width:36px; height:36px; border:3px solid var(--border); border-top-color:var(--accent); border-radius:50%; animation:spin 0.7s linear infinite;"></div>
    <span style="font-size:12px; font-weight:600; letter-spacing:0.12em; color:var(--muted); font-family:'Outfit',sans-serif;">CHARGEMENT</span>
  </div>
  <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
</template>
