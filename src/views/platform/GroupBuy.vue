<template>
  <section class="pad">
    <p v-if="!moduleOn('groupBuy')" class="note">拼团模块已关闭，访客端不再展示。</p>
    <article v-for="item in rows" :key="item.id" class="row">
      <b>{{ item.title }}</b>
      <p>{{ item.joined }}/{{ item.need }} 人 · {{ item.priceText }}</p>
      <button type="button" @click="joinGroup(item.id)">加一人（演示）</button>
    </article>
    <label class="field"><span>新拼团</span><input v-model="title" class="input" /></label>
    <button class="btn-navy stack-btn" type="button" @click="add">创建</button>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { dbState, joinGroup, listGroupBuys, moduleOn, saveGroup } from '../../services/api.js'

const title = ref('')
const rows = computed(() => {
  dbState.groupBuys?.length
  return listGroupBuys()
})

function add() {
  saveGroup(title.value.trim())
  title.value = ''
}
</script>

<style scoped>
.row { background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 8px; }
p { font-size: 12px; color: #666; margin: 4px 0; }
button { color: var(--navy); }
</style>
