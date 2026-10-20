<template>
  <section class="pad">
    <h3>视频</h3>
    <article v-for="video in queue.videos" :key="video.id" class="row-card">
      <div>
        <b>{{ video.title }}</b>
        <p>{{ video.auditStatus === 'pending' ? '待审核' : '已驳回' }}</p>
      </div>
      <div class="actions">
        <button type="button" @click="setAudit(video.id, 'ok')">通过</button>
        <button type="button" class="danger" @click="setAudit(video.id, 'rejected')">驳回</button>
      </div>
    </article>
    <p v-if="!queue.videos.length" class="note">没有待处理的视频。</p>
    <h3>评论</h3>
    <article v-for="comment in queue.comments" :key="comment.id" class="row-card">
      <div>
        <b>{{ comment.nickname }}</b>
        <p>{{ comment.text }}</p>
      </div>
      <button type="button" @click="setCommentStatus(comment.id, comment.status === 'visible' ? 'hidden' : 'visible')">
        {{ comment.status === 'visible' ? '隐藏' : '放出来' }}
      </button>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { auditQueue, dbState, setAudit, setCommentStatus } from '../../services/api.js'

const queue = computed(() => {
  dbState.videos.length
  dbState.comments.length
  return auditQueue()
})
</script>

<style scoped>
h3 {
  font-size: 14px;
  margin: 8px 0;
}
.row-card {
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
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
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}
button {
  color: var(--navy);
  font-size: 13px;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.danger {
  color: #b42318;
}
</style>
