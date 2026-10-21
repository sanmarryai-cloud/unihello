<template>
  <div class="page" v-if="meeting">
    <header class="subhead">
      <button type="button" class="back" @click="$router.push(`/meeting/${meeting.id}`)">‹</button>
      <span>分享会议</span>
      <span class="spacer" />
    </header>
    <section class="pad">
      <div class="cover">
        <span>▶</span>
      </div>
      <h1>会议录制：{{ meeting.title }}</h1>
      <p class="note">回放 ID {{ meeting.code }}。创建者始终可以看完整内容；其他人按下面的开关。</p>
      <div class="linkbox">{{ payload.link }}</div>
      <button class="btn-navy stack-btn" type="button" @click="copy">复制回放链接</button>
      <button class="ghost" type="button" @click="guest">以访客身份预览</button>
      <label class="switch">
        <input type="checkbox" :checked="meeting.shareAccess !== 'creator'" @change="toggle($event.target.checked)" />
        <span>持有链接的人可以看回放</span>
      </label>
      <p class="note">关掉后，只有创建者能看转写和播放。访客打开同一条链接时只看到标题。</p>
      <h2>分享卡片字段</h2>
      <p class="kv">title：{{ payload.title }}</p>
      <p class="kv">path：{{ payload.path }}</p>
      <p class="kv">imageUrl：{{ payload.imageUrl }}</p>
      <p v-if="copied" class="note">{{ copied }}</p>
    </section>
  </div>
  <p v-else class="pad">没有这场会议。</p>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dbState, getMeeting, setShareAccess, sharePayload } from '../services/api.js'

const route = useRoute()
const router = useRouter()
const copied = ref('')
const meeting = computed(() => {
  dbState.meetings?.length
  return getMeeting(String(route.params.id || ''))
})
const payload = computed(() => (meeting.value ? sharePayload(meeting.value) : { title: '', path: '', link: '', imageUrl: '' }))

watch(meeting, (item) => {
  if (!item) return
  document.title = `会议录制：${item.title}`
  setMeta('og:title', `会议录制：${item.title}`)
  setMeta('og:description', item.summary?.review || '超级名片会议回放')
  setMeta('description', item.summary?.review || '超级名片会议回放')
}, { immediate: true })

function setMeta(name, content) {
  const selector = name.startsWith('og:') ? `meta[property="${name}"]` : `meta[name="${name}"]`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    if (name.startsWith('og:')) el.setAttribute('property', name)
    else el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function toggle(open) {
  setShareAccess(meeting.value.id, open ? 'link' : 'creator')
}

async function copy() {
  try {
    await navigator.clipboard.writeText(payload.value.link)
    copied.value = '链接已复制'
  } catch {
    copied.value = payload.value.link
  }
}

function guest() {
  router.push({ path: `/meeting/${meeting.value.id}`, query: { guest: '1' } })
}
</script>

<style scoped>
.back { font-size: 28px; width: 36px; color: #333; }
.spacer { width: 36px; }
.cover {
  height: 180px;
  border-radius: 16px;
  background: linear-gradient(160deg, #1a4f9c, #142d54) center / cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.cover span {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fff;
  color: #1a3a6b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  padding-left: 4px;
}
h1 { font-size: 18px; line-height: 1.4; }
h2 { margin: 16px 0 8px; font-size: 14px; }
.linkbox { background: #fff; border-radius: 10px; padding: 10px; font-size: 12px; word-break: break-all; margin-bottom: 10px; }
.ghost { width: 100%; margin-top: 8px; height: 40px; color: var(--navy); }
.switch { display: flex; gap: 8px; align-items: center; margin-top: 14px; font-size: 14px; }
.kv { font-size: 12px; color: #555; line-height: 1.5; word-break: break-all; }
</style>
