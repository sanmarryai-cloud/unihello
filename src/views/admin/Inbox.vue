<template>
  <section class="pad">
    <p class="note">访客不必加好友就能留言。带「自动回复」的是预设问答，不是接通的大模型。</p>
    <article v-for="thread in threads" :key="thread.id" class="box">
      <b>{{ thread.user?.name || '访客' }}</b>
      <p v-for="message in thread.messages" :key="message.id" :class="message.from">
        {{ who(message.from) }}：{{ message.text }}
      </p>
      <div class="composer">
        <input v-model="drafts[thread.id]" class="input" placeholder="回复" />
        <button type="button" @click="send(thread.id)">发送</button>
      </div>
    </article>
    <p v-if="!threads.length" class="note">还没有留言。</p>
  </section>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { adminCardId, dbState, listThreads, replyThread } from '../../services/api.js'

const drafts = reactive({})
const threads = computed(() => {
  dbState.messages?.length
  dbState.threads?.length
  return listThreads(adminCardId())
})

function who(from) {
  if (from === 'visitor') return '访客'
  if (from === 'bot') return '自动回复'
  return '我'
}

function send(id) {
  replyThread(id, drafts[id] || '')
  drafts[id] = ''
}
</script>

<style scoped>
.box { background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 10px; }
b { font-size: 14px; }
p { font-size: 13px; margin-top: 6px; line-height: 1.4; }
.bot { color: #1a3a6b; }
.composer { display: flex; gap: 8px; margin-top: 8px; }
.composer .input { flex: 1; }
button { color: var(--navy); }
</style>
