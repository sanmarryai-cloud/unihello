<template>
  <section class="pad">
    <p class="note">来源会标成扫码、单聊、群聊、朋友圈或搜索。意向分按打开、反复看视频、拨号和回递累加。</p>
    <article v-for="row in rows" :key="row.user?.id || row.source" class="row-card">
      <header>
        <img :src="row.user?.avatar" alt="" />
        <div>
          <b>{{ row.user?.name || '访客' }}</b>
          <p>意向 {{ row.score }} · 观看 {{ row.watchSec }} 秒</p>
          <div class="tags">
            <span v-for="tag in row.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </header>
      <ul>
        <li v-for="event in row.timeline" :key="event.id">
          {{ label(event) }}
          <em>{{ time(event.at) }}</em>
        </li>
      </ul>
    </article>
    <p v-if="!rows.length" class="note">还没有访客记录。</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { adminCardId, dbState, EVENT_LABEL, listCardVideos, visitorInsights } from '../../services/api.js'

const cardId = computed(() => {
  dbState.meta && dbState.meta.adminCardId
  return adminCardId()
})
const rows = computed(() => {
  dbState.visit_events.length
  dbState.visits.length
  return visitorInsights(cardId.value)
})

function time(stamp) {
  const date = new Date(stamp)
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getMonth() + 1}/${date.getDate()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function label(event) {
  const name = EVENT_LABEL[event.type] || event.type
  if (!event.videoId) return event.durationSec ? `${name} ${event.durationSec} 秒` : name
  const video = listCardVideos(cardId.value).find((item) => item.id === event.videoId)
  const title = video?.title || '视频'
  return event.durationSec ? `${name}「${title}」${event.durationSec} 秒` : `${name}「${title}」`
}
</script>

<style scoped>
.row-card {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 10px;
}
header {
  display: flex;
  gap: 10px;
  align-items: center;
}
img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #eee;
}
b {
  font-size: 14px;
}
header p {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}
.tags span {
  font-size: 11px;
  color: #1a3a6b;
  background: #e8eef8;
  border-radius: 8px;
  padding: 2px 6px;
}
ul {
  margin-top: 8px;
  padding-left: 18px;
}
li {
  font-size: 12px;
  color: #444;
  line-height: 1.7;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
em {
  color: #aaa;
  font-style: normal;
  flex-shrink: 0;
}
</style>
