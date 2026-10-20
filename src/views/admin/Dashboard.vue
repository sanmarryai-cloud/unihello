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
    <p class="note">次数来自本机记录。打开名片、播放、点联系、回递都会写进访客雷达。</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { dashboard, dbState, getCard } from '../../services/api.js'

const card = computed(() => {
  dbState.cards.length
  return getCard('card_main')
})
const stats = computed(() => {
  dbState.visit_events.length
  dbState.visits.length
  dbState.referral_edges.length
  dbState.comments.length
  return dashboard('card_main')
})
</script>
