<template>
  <div class="page admin-page">
    <header class="subhead">
      <button type="button" class="back" @click="$router.push('/')">‹</button>
      <span>名片管理</span>
      <span class="spacer" />
    </header>
    <nav class="subnav">
      <router-link to="/admin">概览</router-link>
      <router-link to="/admin/profile">资料</router-link>
      <router-link to="/admin/library">视频</router-link>
      <router-link to="/admin/radar">雷达</router-link>
      <router-link to="/admin/notices">通知</router-link>
      <router-link to="/admin/comments">评论</router-link>
      <router-link to="/admin/qrcode">活码</router-link>
      <router-link to="/admin/inbox">咨询</router-link>
      <router-link to="/admin/rewards">红包</router-link>
      <router-link to="/admin/team">团队</router-link>
      <router-link to="/admin/crm">客户</router-link>
      <router-link to="/admin/company">公司</router-link>
      <router-link to="/admin/reports">日报</router-link>
      <router-link to="/admin/site">官网</router-link>
      <router-link to="/admin/identities">身份</router-link>
      <router-link to="/admin/imports">素材</router-link>
      <router-link to="/admin/meetings">{{ meetingsOn ? '会议' : '会议·未开通' }}</router-link>
      <router-link :to="{ path: '/poster', query: { card: cardId } }">海报</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { adminCardId, dbState, meetingsEnabled } from '../../services/api.js'

const cardId = computed(() => {
  dbState.meta && dbState.meta.adminCardId
  dbState.cards.length
  return adminCardId()
})
const meetingsOn = computed(() => meetingsEnabled(cardId.value))
</script>

<style scoped>
.back {
  font-size: 28px;
  width: 36px;
  color: #333;
}
.spacer {
  width: 36px;
}
</style>
