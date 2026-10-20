<template>
  <section class="pad">
    <p class="note">谁打开过这张名片、看了哪条视频、停了多久、有没有点联系或回递。</p>
    <article v-for="row in rows" :key="row.user?.id" class="row-card">
      <header>
        <img :src="row.user?.avatar" alt="" />
        <div>
          <b>{{ row.user?.name || '访客' }}</b>
          <p>观看 {{ row.watchSec }} 秒 · 联系 {{ row.contacts }} · 回递 {{ row.returns }}</p>
        </div>
      </header>
      <ul>
        <li v-for="event in row.events.slice(0, 6)" :key="event.id">
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
import { dbState, EVENT_LABEL, listCardVideos, radar } from '../../services/api.js'

const rows = computed(() => {
  dbState.visit_events.length
  return radar('card_main')
})

function time(stamp) {
  const date = new Date(stamp)
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getMonth() + 1}/${date.getDate()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function label(event) {
  const name = EVENT_LABEL[event.type] || event.type
  if (!event.videoId) return event.durationSec ? `${name} ${event.durationSec} 秒` : name
  const video = listCardVideos('card_main').find((item) => item.id === event.videoId)
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
