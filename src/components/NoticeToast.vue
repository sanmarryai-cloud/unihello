<template>
  <div v-if="text" class="live-toast">{{ text }}</div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { dbState } from '../services/api.js'

const route = useRoute()
const text = ref('')
let timer = null

watch(
  () => dbState.notices?.length || 0,
  (count, previous) => {
    if (!previous || count <= previous) return
    if (!route.path.startsWith('/admin') && !route.path.startsWith('/platform')) return
    const last = dbState.notices[dbState.notices.length - 1]
    text.value = `${last?.title || '新动态'}：${last?.body || ''}`
    clearTimeout(timer)
    timer = setTimeout(() => {
      text.value = ''
    }, 2400)
  },
)
</script>

<style scoped>
.live-toast {
  position: fixed;
  left: 50%;
  top: 16px;
  transform: translateX(-50%);
  width: min(340px, calc(100% - 24px));
  background: #142d54;
  color: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 13px;
  line-height: 1.45;
  z-index: 1000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}
</style>
