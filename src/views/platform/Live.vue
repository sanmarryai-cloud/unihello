<template>
  <section class="pad">
    <p v-if="!moduleOn('live')" class="note">直播入口已关闭。</p>
    <article v-for="item in rows" :key="item.id" class="row">
      <b>{{ item.title }}</b>
      <a :href="item.url" target="_blank" rel="noreferrer">{{ item.url || '未填链接' }}</a>
    </article>
    <label class="field"><span>标题</span><input v-model="title" class="input" /></label>
    <label class="field"><span>链接</span><input v-model="url" class="input" placeholder="https://" /></label>
    <button class="btn-navy stack-btn" type="button" @click="add">添加入口</button>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { dbState, listLive, moduleOn, saveLive } from '../../services/api.js'

const title = ref('')
const url = ref('')
const rows = computed(() => {
  dbState.liveLinks?.length
  return listLive()
})

function add() {
  saveLive(title.value.trim(), url.value.trim())
  title.value = ''
  url.value = ''
}
</script>

<style scoped>
.row { background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 8px; }
a { font-size: 12px; color: var(--navy); word-break: break-all; }
</style>
