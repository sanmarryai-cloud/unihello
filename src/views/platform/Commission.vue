<template>
  <section class="pad">
    <p class="note">每一条回递记 10 个演示积分，只做追踪，不结算。</p>
    <p v-if="!moduleOn('commission')" class="note">分佣模块已关闭。</p>
    <article v-for="item in rows" :key="item.id" class="row">
      <b>{{ item.from }} → {{ item.to }}</b>
      <p>{{ item.amount }} · scene={{ item.scene }}</p>
      <p>{{ item.note }}</p>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { dbState, listCommissions, moduleOn } from '../../services/api.js'

const rows = computed(() => {
  dbState.referral_edges.length
  return listCommissions()
})
</script>

<style scoped>
.row { background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 8px; }
p { font-size: 12px; color: #666; margin-top: 4px; }
</style>
