<template>
  <section class="pad">
    <p class="note">红包和排行榜只记在本地，不会打款。</p>
    <label class="field"><span>活动名</span><input v-model="form.title" class="input" /></label>
    <label class="field"><span>奖励文案</span><input v-model="form.reward" class="input" /></label>
    <label class="field"><span>规则</span><input v-model="form.rule" class="input" /></label>
    <label class="check"><input v-model="form.enabled" type="checkbox" /> 对访客展示</label>
    <button class="btn-navy stack-btn" type="button" @click="save">保存活动</button>
    <h3>邀请榜</h3>
    <p v-for="(row, index) in board" :key="index" class="rank">{{ index + 1 }}. {{ row.user.name }} · {{ row.score }}</p>
    <p v-if="!board.length" class="note">还没有人上榜。</p>
  </section>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { adminCardId, campaignOf, dbState, leaderboard, saveCampaign } from '../../services/api.js'

const current = campaignOf(adminCardId())
const form = reactive({
  title: current?.title || '扫码领红包',
  reward: current?.reward || '8.8 元红包（演示，不到账）',
  rule: current?.rule || '回递或留手机即可',
  enabled: current ? current.enabled !== false : true,
})
const board = computed(() => {
  dbState.claims?.length
  dbState.referral_edges.length
  return leaderboard(adminCardId())
})

function save() {
  saveCampaign(adminCardId(), { ...form })
}
</script>

<style scoped>
.check { display: flex; gap: 8px; align-items: center; font-size: 14px; margin-bottom: 12px; }
h3 { margin: 16px 0 8px; font-size: 15px; }
.rank { background: #fff; border-radius: 10px; padding: 10px 12px; margin-bottom: 6px; font-size: 14px; }
</style>
