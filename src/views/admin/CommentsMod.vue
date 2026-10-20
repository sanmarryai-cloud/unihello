<template>
  <section class="pad">
    <article v-for="comment in comments" :key="comment.id" class="row-card">
      <div>
        <b>{{ comment.nickname }}</b>
        <p>{{ comment.text }}</p>
        <em>{{ comment.status === 'visible' ? '展示中' : '已隐藏' }}</em>
      </div>
      <button type="button" @click="toggle(comment)">
        {{ comment.status === 'visible' ? '隐藏' : '展示' }}
      </button>
    </article>
    <p v-if="!comments.length" class="note">还没有评论。</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { allComments, dbState, setCommentStatus } from '../../services/api.js'

const comments = computed(() => {
  dbState.comments.length
  return allComments('card_main')
})

function toggle(comment) {
  setCommentStatus(comment.id, comment.status === 'visible' ? 'hidden' : 'visible')
}
</script>

<style scoped>
.row-card {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}
b {
  font-size: 14px;
}
p {
  font-size: 13px;
  margin: 4px 0;
  line-height: 1.4;
}
em {
  font-style: normal;
  font-size: 12px;
  color: #888;
}
button {
  color: var(--navy);
  font-size: 13px;
  flex-shrink: 0;
}
</style>
