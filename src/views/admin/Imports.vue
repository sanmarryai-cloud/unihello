<template>
  <section class="pad">
    <p class="note">把腾讯会议、抖音、快手、视频号或 B 站链接存成一条资料。真正抓取内容标记为待接入，现在只保存链接。</p>
    <label class="field">
      <span>来源</span>
      <select v-model="platform" class="select">
        <option>腾讯会议</option>
        <option>抖音</option>
        <option>快手</option>
        <option>视频号</option>
        <option>B站</option>
      </select>
    </label>
    <label class="field"><span>标题</span><input v-model="title" class="input" /></label>
    <label class="field"><span>链接</span><input v-model="url" class="input" placeholder="https://" /></label>
    <button class="btn-navy stack-btn" type="button" @click="add">保存链接</button>
    <article v-for="item in items" :key="item.id" class="row">
      <b>{{ item.platform }} · {{ item.title }}</b>
      <p>{{ item.url || '未填链接' }}</p>
      <em>{{ item.status }}</em>
    </article>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { addImport, adminCardId, dbState, listImports } from '../../services/api.js'

const platform = ref('视频号')
const title = ref('')
const url = ref('')
const items = computed(() => {
  dbState.imports?.length
  return listImports(adminCardId())
})

function add() {
  addImport(adminCardId(), platform.value, title.value.trim() || platform.value, url.value.trim())
  title.value = ''
  url.value = ''
}
</script>

<style scoped>
.row { background: #fff; border-radius: 12px; padding: 12px; margin-top: 8px; }
p, em { display: block; font-size: 12px; color: #777; margin-top: 4px; font-style: normal; }
</style>
