<template>
  <section class="pad">
    <article class="hero">
      <b>{{ daily.title }}</b>
      <p>{{ daily.summary }}</p>
    </article>
    <article class="hero week">
      <b>{{ weekly.title }}</b>
      <p>{{ weekly.summary }}</p>
    </article>
    <p class="note">没有定时推送。数字来自这台浏览器里已经发生的访问。</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { adminCardId, buildReport, dbState } from '../../services/api.js'

const cardId = computed(() => {
  dbState.meta && dbState.meta.adminCardId
  return adminCardId()
})
const daily = computed(() => {
  dbState.visit_events.length
  return buildReport(cardId.value, 1)
})
const weekly = computed(() => buildReport(cardId.value, 7))
</script>

<style scoped>
.hero { background: #142d54; color: #fff; border-radius: 14px; padding: 16px; margin-bottom: 10px; }
.week { background: #fff; color: #222; }
b { font-size: 16px; }
p { margin-top: 8px; font-size: 14px; line-height: 1.5; }
</style>
