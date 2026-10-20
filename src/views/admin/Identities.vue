<template>
  <section class="pad">
    <p class="note">同一个人可以有多张名片。切换后，资料、视频和雷达都对着当前这张。</p>
    <article v-for="card in cards" :key="card.id" class="row" :class="{ on: card.id === current }">
      <div>
        <b>{{ card.name }}</b>
        <p>{{ card.detail || card.company }}</p>
      </div>
      <button type="button" @click="setAdminCard(card.id)">{{ card.id === current ? '使用中' : '切换' }}</button>
    </article>
    <label class="field"><span>新身份名称</span><input v-model="name" class="input" placeholder="例如：会务" /></label>
    <button class="btn-navy stack-btn" type="button" @click="create">新建并切换</button>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { adminCardId, createIdentity, dbState, ownedCards, setAdminCard } from '../../services/api.js'

const name = ref('')
const current = computed(() => {
  dbState.meta && dbState.meta.adminCardId
  return adminCardId()
})
const cards = computed(() => {
  dbState.cards.length
  return ownedCards()
})

function create() {
  if (!name.value.trim()) return
  createIdentity(name.value.trim())
  name.value = ''
}
</script>

<style scoped>
.row { display: flex; justify-content: space-between; gap: 8px; align-items: center; background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 8px; }
.on { outline: 1px solid var(--navy); }
p { font-size: 12px; color: #888; margin-top: 4px; }
button { color: var(--navy); }
</style>
