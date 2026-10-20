<template>
  <div class="app-shell">
    <div class="phone-frame">
      <router-view />
      <NoticeToast />
    </div>
  </div>
</template>

<script setup>
import NoticeToast from './components/NoticeToast.vue'
</script>
