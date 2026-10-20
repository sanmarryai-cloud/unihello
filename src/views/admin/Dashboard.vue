<template>
  <section class="pad">
    <p class="who">正在管理：{{ card?.name }} · {{ card?.company }}</p>
    <div class="stat-grid">
      <div><b>{{ stats.visits }}</b><span>访客</span></div>
      <div><b>{{ stats.plays }}</b><span>播放</span></div>
      <div><b>{{ stats.watchSec }}s</b><span>观看时长</span></div>
      <div><b>{{ stats.contacts }}</b><span>联系点击</span></div>
      <div><b>{{ stats.returns }}</b><span>回递</span></div>
      <div><b>{{ stats.comments }}</b><span>评论</span></div>
    </div>
    <button class="report" type="button" @click="$router.push('/admin/reports')">
      <b>每晚日报</b>
      <span>{{ daily.summary }}</span>
    </button>
    <p class="note">次数来自本机记录。打开名片、播放、点联系、回递都会写进访客雷达。</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { adminCardId, buildReport, dashboard, dbState, getCard } from '../../services/api.js'

const cardId = computed(() => {
  dbState.meta && dbState.meta.adminCardId
  return adminCardId()
})
const card = computed(() => {
  dbState.cards.length
  return getCard(cardId.value)
})
const stats = computed(() => {
  dbState.visit_events.length
  dbState.visits.length
  dbState.referral_edges.length
  dbState.comments.length
  return dashboard(cardId.value)
})
const daily = computed(() => {
  dbState.visit_events.length
  return buildReport(cardId.value, 1)
})
</script>

<style scoped>
.report {
  width: 100%;
  text-align: left;
  margin-top: 12px;
  background: #142d54;
  color: #fff;
  border-radius: 12px;
  padding: 14px;
}
.report b { display: block; font-size: 15px; }
.report span { display: block; margin-top: 6px; font-size: 13px; line-height: 1.45; }
</style>
