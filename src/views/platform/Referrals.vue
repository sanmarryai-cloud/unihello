<template>
  <section class="pad">
    <p class="note">从主名片往下的回递关系。scene 是打开链接时带上的场景码。</p>
    <div class="root">{{ root?.name }} · {{ root?.company }}</div>
    <div v-for="row in rows" :key="row.edge.id" class="node" :style="{ marginLeft: `${(row.depth - 1) * 16}px` }">
      <b>{{ row.card?.name || row.user?.name }}</b>
      <span>scene={{ row.edge.scene }} · 来自 {{ parentName(row.edge.parentCardId) }}</span>
    </div>
    <p v-if="!rows.length" class="note">还没有回递。</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { dbState, getCard, referralRows } from '../../services/api.js'

const root = computed(() => {
  dbState.cards.length
  return getCard('card_main')
})
const rows = computed(() => {
  dbState.referral_edges.length
  return referralRows()
})

function parentName(id) {
  return getCard(id)?.name || '名片'
}
</script>

<style scoped>
.root,
.node {
  background: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
}
.root {
  font-weight: 600;
  color: var(--navy);
}
b {
  display: block;
  font-size: 14px;
}
span {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #888;
}
</style>
