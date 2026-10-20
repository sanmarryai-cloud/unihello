<template>
  <section class="pad">
    <div class="stat-grid">
      <div><b>{{ stats.users }}</b><span>用户</span></div>
      <div><b>{{ stats.cards }}</b><span>名片</span></div>
      <div><b>{{ stats.visits }}</b><span>访问</span></div>
      <div><b>{{ stats.referrals }}</b><span>推荐边</span></div>
      <div><b>{{ stats.comments }}</b><span>评论</span></div>
      <div><b>{{ stats.pendingVideos }}</b><span>待审视频</span></div>
    </div>
    <p class="note">没有商城、支付和预约。套餐与审核都是演示开关，数据留在这台浏览器。</p>
    <button class="btn-line" type="button" @click="reset">恢复初始演示数据</button>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { dbState, platformOverview, resetDemo } from '../../services/api.js'

const stats = computed(() => {
  dbState.users.length
  dbState.cards.length
  dbState.visits.length
  dbState.referral_edges.length
  dbState.comments.length
  dbState.videos.length
  return platformOverview()
})

function reset() {
  resetDemo()
}
</script>

<style scoped>
.btn-line {
  width: 100%;
  margin-top: 8px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid var(--navy);
  color: var(--navy);
}
</style>
