<template>
  <div class="page play" v-if="meeting">
    <header class="subhead">
      <button type="button" class="back" @click="$router.push('/')">‹</button>
      <span>会议回放</span>
      <button type="button" class="share" @click="$router.push(`/meeting/${meeting.id}/share`)">分享</button>
    </header>

    <section class="hero">
      <h1>{{ meeting.title }}</h1>
      <p>会议时间 {{ formatWhen(meeting.startAt) }}</p>
      <p>会议 ID {{ meeting.code }}</p>
    </section>

    <section v-if="!allowed" class="pad lock">
      <p>这场回放只对创建者开放。你打开了分享链接，但当前身份看不到正文。</p>
      <button type="button" @click="$router.push(`/meeting/${meeting.id}/share`)">查看分享设置</button>
    </section>

    <template v-else>
      <MeetingPlayer ref="player" :meeting="meeting" @time="onTime" />
      <label class="search">
        <input v-model="query" class="input" placeholder="搜索转写" />
      </label>
      <p v-if="hits.length" class="hits">
        <button v-for="line in hits" :key="line.id" type="button" @click="jump(line)">
          {{ formatClock(line.start) }} {{ speakerName(line.speakerId) }}
        </button>
      </p>
      <div class="tabs">
        <button type="button" :class="{ on: tab === 'summary' }" @click="tab = 'summary'">会议总结</button>
        <button type="button" :class="{ on: tab === 'minutes' }" @click="tab = 'minutes'">纪要</button>
        <button type="button" :class="{ on: tab === 'transcript' }" @click="tab = 'transcript'">转写</button>
        <button type="button" :class="{ on: tab === 'speakers' }" @click="tab = 'speakers'">发言人</button>
      </div>

      <section v-if="tab === 'summary'" class="pad block">
        <h2>快速回顾</h2>
        <p>{{ meeting.summary.review }}</p>
        <h2>会议总结</h2>
        <p v-for="(para, index) in longform" :key="index">{{ para }}</p>
      </section>

      <section v-else-if="tab === 'minutes'" class="pad block">
        <h2>议题</h2>
        <ul><li v-for="item in meeting.minutes.topics" :key="item">{{ item }}</li></ul>
        <h2>共识</h2>
        <ul><li v-for="item in meeting.minutes.consensus" :key="item">{{ item }}</li></ul>
        <h2>决议</h2>
        <ul><li v-for="item in meeting.minutes.decisions" :key="item">{{ item }}</li></ul>
        <h2>待办</h2>
        <article v-for="item in meeting.minutes.todos" :key="item.text" class="todo">
          <b>{{ item.text }}</b>
          <span>{{ item.owner }} · {{ item.due }}</span>
        </article>
      </section>

      <section v-else-if="tab === 'transcript'" class="pad lines">
        <button
          v-for="line in meeting.transcript"
          :id="`line-${line.id}`"
          :key="line.id"
          type="button"
          class="line"
          :class="{ on: line.id === activeId, dim: query && !line.text.includes(query.trim()) }"
          @click="jump(line)"
        >
          <em>{{ formatClock(line.start) }} {{ speakerName(line.speakerId) }}</em>
          <span>
            <template v-for="(part, index) in parts(line.text)" :key="index">
              <mark v-if="part.hit">{{ part.text }}</mark>
              <template v-else>{{ part.text }}</template>
            </template>
          </span>
        </button>
      </section>

      <section v-else class="pad block">
        <p class="digest">{{ meeting.speakerDigest }}</p>
        <article v-for="speaker in speakerGroups" :key="speaker.id" class="person">
          <header>
            <input :value="speaker.name" @change="rename(speaker, $event.target.value)" />
            <span>{{ speaker.talkSec }} 秒 · {{ speaker.share }}%</span>
          </header>
          <div class="meter"><i :style="{ width: `${speaker.share}%` }" /></div>
          <button
            v-for="line in speaker.lines"
            :id="`line-${line.id}`"
            :key="line.id"
            type="button"
            class="line"
            :class="{ on: line.id === activeId }"
            @click="jump(line)"
          >
            <em>{{ formatClock(line.start) }}</em>
            <span>{{ line.text }}</span>
          </button>
        </article>
      </section>

      <div class="pad actions">
        <button class="btn-navy stack-btn" type="button" @click="saveCloud">{{ cloudText }}</button>
        <button class="text" type="button" @click="reportOpen = true">举报</button>
      </div>
    </template>

    <p class="disclaimer">{{ AI_DISCLAIMER }}</p>

    <div v-if="reportOpen" class="sheet-mask" @click.self="reportOpen = false">
      <div class="sheet">
        <strong>举报这场会议</strong>
        <button v-for="reason in reasons" :key="reason" type="button" class="reason" @click="sendReport(reason)">{{ reason }}</button>
      </div>
    </div>
    <p v-if="toast" class="toast">{{ toast }}</p>
  </div>
  <p v-else class="pad">没有这场会议。</p>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MeetingPlayer from '../components/MeetingPlayer.vue'
import {
  AI_DISCLAIMER,
  canViewMeeting,
  createTicket,
  dbState,
  formatClock,
  formatWhen,
  getMeeting,
  listCloud,
  renameSpeaker,
  saveToCloud,
} from '../services/api.js'

const route = useRoute()
const tab = ref('summary')
const query = ref('')
const current = ref(0)
const player = ref(null)
const reportOpen = ref(false)
const toast = ref('')
const reasons = ['不当内容', '骚扰', '其他']
let toastTimer = null

const meeting = computed(() => {
  dbState.meetings?.length
  dbState.cloudFiles?.length
  return getMeeting(String(route.params.id || ''))
})
const allowed = computed(() => canViewMeeting(meeting.value, route.query.guest === '1'))
const longform = computed(() => String(meeting.value?.summary?.longform || '').split('\n').filter(Boolean))
const activeId = computed(() => {
  const lines = meeting.value?.transcript || []
  const hit = lines.find((line) => current.value >= line.start && current.value < line.end)
  return hit?.id || ''
})
const hits = computed(() => {
  const q = query.value.trim()
  if (!q) return []
  return (meeting.value?.transcript || []).filter((line) => line.text.includes(q))
})
const speakerGroups = computed(() => {
  const duration = meeting.value?.durationSec || 1
  return (meeting.value?.speakers || []).map((speaker) => ({
    ...speaker,
    share: Math.round((speaker.talkSec / duration) * 100),
    lines: (meeting.value?.transcript || []).filter((line) => line.speakerId === speaker.id),
  }))
})
const cloudText = computed(() => {
  const saved = listCloud().some((item) => item.meetingId === meeting.value?.id)
  return saved ? '已在云盘' : '转存到我的云盘'
})

watch(activeId, async (id) => {
  if (!id || (tab.value !== 'transcript' && tab.value !== 'speakers')) return
  await nextTick()
  document.getElementById(`line-${id}`)?.scrollIntoView({ block: 'nearest' })
})

watch(meeting, (item) => {
  if (item) document.title = `会议录制：${item.title}`
}, { immediate: true })

watch(query, (value) => {
  if (value.trim()) tab.value = 'transcript'
})

function onTime(value) {
  current.value = value
}

function jump(line) {
  tab.value = tab.value === 'speakers' ? 'speakers' : 'transcript'
  player.value?.seek(line.start)
}

function speakerName(id) {
  return meeting.value?.speakers?.find((item) => item.id === id)?.name || id
}

function parts(text) {
  const q = query.value.trim()
  if (!q) return [{ hit: false, text }]
  const out = []
  let rest = text
  while (rest.includes(q)) {
    const index = rest.indexOf(q)
    if (index > 0) out.push({ hit: false, text: rest.slice(0, index) })
    out.push({ hit: true, text: q })
    rest = rest.slice(index + q.length)
  }
  if (rest) out.push({ hit: false, text: rest })
  return out
}

function rename(speaker, name) {
  renameSpeaker(meeting.value.id, speaker.id, name)
}

function saveCloud() {
  const result = saveToCloud(meeting.value.id)
  show(result?.already ? '云盘里已经有这场' : '已转存到云盘')
}

function sendReport(reason) {
  createTicket({ meetingId: meeting.value.id, reason })
  reportOpen.value = false
  show('已提交举报工单')
}

function show(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = ''
  }, 1600)
}
</script>

<style scoped>
.back { font-size: 28px; width: 36px; color: #333; }
.share { width: 48px; color: var(--navy); font-size: 14px; }
.hero {
  margin: 12px;
  padding: 16px;
  border-radius: 16px;
  background: linear-gradient(160deg, #1a4f9c, #16356f);
  color: #fff;
}
.hero h1 { font-size: 20px; line-height: 1.35; }
.hero p { margin-top: 6px; font-size: 13px; opacity: 0.9; }
.search { display: block; margin: 12px; }
.hits { display: flex; gap: 6px; overflow-x: auto; padding: 0 12px 8px; }
.hits button { flex-shrink: 0; background: #fff; border-radius: 12px; padding: 4px 8px; font-size: 12px; color: var(--navy); }
.tabs { display: flex; gap: 6px; padding: 0 12px; }
.tabs button { flex: 1; height: 34px; border-radius: 17px; background: #fff; font-size: 13px; color: #555; }
.tabs .on { background: var(--navy); color: #fff; }
.block h2 { margin: 14px 0 6px; font-size: 15px; }
.block p, .digest { font-size: 14px; line-height: 1.6; color: #333; }
.block ul { padding-left: 18px; }
.block li { font-size: 14px; line-height: 1.6; }
.todo { background: #fff; border-radius: 12px; padding: 10px 12px; margin-top: 8px; }
.todo b { display: block; font-size: 14px; }
.todo span { font-size: 12px; color: #888; }
.line {
  width: 100%;
  text-align: left;
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 8px;
}
.line em { display: block; font-style: normal; font-size: 12px; color: #888; }
.line span { display: block; margin-top: 4px; font-size: 14px; line-height: 1.5; }
.line.on { outline: 2px solid #2b6de5; }
.line.dim { opacity: 0.4; }
.line mark { background: #ffe08a; }
.person { margin-top: 12px; }
.person header { display: flex; justify-content: space-between; gap: 8px; align-items: center; }
.person input { border: none; background: transparent; font-size: 15px; font-weight: 600; width: 46%; }
.person header span { font-size: 12px; color: #888; }
.meter { height: 6px; background: #e6e6e6; border-radius: 4px; margin: 6px 0 8px; }
.meter i { display: block; height: 100%; background: #1a4f9c; border-radius: 4px; }
.actions { display: flex; flex-direction: column; gap: 8px; }
.text { color: #888; font-size: 13px; }
.disclaimer { text-align: center; color: #999; font-size: 12px; padding: 4px 16px 24px; }
.lock { background: #fff; margin: 12px; border-radius: 12px; }
.lock button { margin-top: 8px; color: var(--navy); }
.reason { display: block; width: 100%; text-align: left; padding: 12px 0; border-bottom: 1px solid #f2f2f2; font-size: 15px; }
</style>
