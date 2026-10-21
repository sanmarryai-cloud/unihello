<template>
  <div class="page home" :class="card ? `theme-${card.templateId || 'navy'}` : ''">
    <div class="mp-chrome">
      <span class="mp-title">超级名片</span>
      <div class="mp-actions">
        <button type="button" class="mp-dot" @click="menuOpen = !menuOpen">···</button>
        <button type="button" class="mp-close" @click="$router.push('/my')">○</button>
      </div>
      <div v-if="menuOpen" class="menu-pop">
        <button type="button" @click="goMenu('/admin')">名片管理</button>
        <button type="button" @click="goMenu('/platform')">平台后台</button>
        <button type="button" @click="openShare">分享这张名片</button>
      </div>
    </div>

    <template v-if="card">
      <div class="banner" :style="{ backgroundImage: `url(${card.banner})` }">
        <div class="banner-mask" />
      </div>

      <div class="profile-card">
        <div class="profile-top">
          <div class="profile-info">
            <h1 class="name">{{ card.name }}</h1>
            <a class="phone" :href="`tel:${card.phone}`" @click="onContact">{{ card.phone || '未留手机' }}</a>
          </div>
          <button class="btn-contact" type="button" @click="onContact">联系Ta</button>
        </div>
        <div class="profile-meta">
          <span class="company">{{ card.company || '未填写公司' }}</span>
          <span v-if="card.verifiedPerson" class="badge">实名</span>
          <span v-if="card.verifiedCompany" class="badge firm">企业认证</span>
          <button class="detail-btn" type="button" @click="showCompany = !showCompany">
            详情 {{ showCompany ? '▲' : '▼' }}
          </button>
        </div>
        <div v-if="showCompany" class="company-extra">
          <p>{{ card.detail || '演示名片，公司与资料均为虚构。' }}</p>
          <p v-if="card.legalName">工商名称 {{ card.legalName }}</p>
          <p v-if="card.creditCode">统一社会信用代码 {{ card.creditCode }}</p>
          <p v-if="card.address">住所 {{ card.address }}</p>
          <p v-if="card.scope">经营范围 {{ card.scope }}</p>
          <p v-if="card.founded">成立 {{ card.founded }}</p>
        </div>
        <div class="city"><span class="pin">📍</span> {{ card.city || '未设置城市' }}</div>
      </div>

      <div class="social-row">
        <button class="pill like-pill" type="button" @click="onLike">
          {{ likes }} 人觉得名片好看
        </button>
        <button class="icon-btn" type="button" @click="commentOpen = true">
          <span class="ico">💬</span> 评论
        </button>
        <button class="icon-btn" :class="{ active: liked }" type="button" @click="onLike">
          <span class="ico">{{ liked ? '❤️' : '🤍' }}</span> 点赞
        </button>
      </div>

      <VisitorExtras :card="card" />

      <section v-if="meetingsOn" class="meeting-entry">
        <div class="meeting-head"><b>会议录制</b></div>
        <button
          v-for="item in meetingRows"
          :key="item.id"
          type="button"
          class="meeting-row"
          @click="$router.push(`/meeting/${item.id}`)"
        >
          <span class="play-dot">▶</span>
          <span>
            <strong>会议录制：{{ item.title }}</strong>
            <em>{{ item.type === 'av' ? '音视频' : '纯音频' }} · {{ item.code }}</em>
          </span>
        </button>
        <p v-if="!meetingRows.length" class="meeting-empty">还没有可回放的会议。</p>
      </section>

      <div class="comment-preview" @click="commentOpen = true">
        <template v-if="preview">
          <img :src="preview.avatar" class="c-avatar" alt="" />
          <div class="c-body">
            <span class="c-name">{{ preview.nickname }}</span>
            <span class="c-text">{{ preview.text }}</span>
          </div>
          <span class="c-thumb">{{ comments.length }}</span>
        </template>
        <p v-else class="c-empty">还没有评论，点这里写一条</p>
      </div>

      <div class="tabs-wrap">
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="tab"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <div class="section-head">— {{ currentTab?.name || '内容' }} —</div>
      <div class="resource-list">
        <div
          v-for="item in resources"
          :key="item.id"
          class="resource-card"
          @click="openResource(item)"
        >
          <div class="thumb" :style="{ background: item.cover }">
            <span v-if="item.type === 'video' || item.type === 'live'" class="play">▶</span>
            <span v-else class="type-badge">{{ typeLabel[item.type] || '内容' }}</span>
          </div>
          <div class="res-body">
            <div class="res-title">{{ item.title }}</div>
            <div class="res-meta">{{ item.note || item.size }}</div>
          </div>
        </div>
        <p v-if="!resources.length" class="empty-res">这个分类还没有可展示的内容。</p>
      </div>

      <div class="bottom-bar">
        <div class="avatars">
          <img
            v-for="(avatar, index) in returnFaces"
            :key="avatar + index"
            :src="avatar"
            class="av"
            :style="{ zIndex: 3 - index, marginLeft: index ? '-8px' : '0' }"
            alt=""
          />
        </div>
        <span class="return-text">{{ returns }}人 已回递Ta的同款名片</span>
        <button class="btn-return" type="button" @click="goReturn">立即回递</button>
      </div>
    </template>
    <p v-else class="missing">没有找到这张名片。</p>

    <div v-if="toastMsg" class="toast">{{ toastMsg }}</div>

    <PlayerDialog v-if="playing" :video="playing" @close="onPlayerClose" />

    <div v-if="commentOpen" class="sheet-mask" @click.self="commentOpen = false">
      <div class="sheet">
        <div class="sheet-top">
          <strong>评论</strong>
          <button type="button" @click="commentOpen = false">关闭</button>
        </div>
        <div v-for="comment in comments" :key="comment.id" class="c-row">
          <img :src="comment.avatar" alt="" />
          <div>
            <b>{{ comment.nickname }}</b>
            <p>{{ comment.text }}</p>
          </div>
        </div>
        <p v-if="!comments.length" class="note">来写第一条演示评论。</p>
        <div class="composer">
          <input v-model="draft" class="input" maxlength="80" placeholder="说点什么" />
          <button class="btn-navy" type="button" @click="sendComment">发送</button>
        </div>
      </div>
    </div>

    <div v-if="shareOpen && card" class="sheet-mask" @click.self="shareOpen = false">
      <div class="sheet">
        <div class="sheet-top">
          <strong>分享</strong>
          <button type="button" @click="shareOpen = false">关闭</button>
        </div>
        <SharePanel :card-id="card.id" :scene="shareScene" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PlayerDialog from '../components/PlayerDialog.vue'
import SharePanel from '../components/SharePanel.vue'
import VisitorExtras from '../components/VisitorExtras.vue'
import {
  addComment,
  addEvent,
  childCards,
  dbState,
  getCard,
  likeCount,
  likedByMe,
  listMeetings,
  listTabs,
  listVideos,
  meetingsEnabled,
  recordOpen,
  toggleLike,
  TYPE_LABEL as typeLabel,
  visibleComments,
} from '../services/api.js'

const route = useRoute()
const router = useRouter()
const activeTab = ref('')
const showCompany = ref(false)
const menuOpen = ref(false)
const commentOpen = ref(false)
const shareOpen = ref(false)
const playing = ref(null)
const draft = ref('')
const toastMsg = ref('')
let toastTimer = null

const cardId = computed(() => String(route.query.card || 'card_main'))
const scene = computed(() => String(route.query.scene || 'direct'))
const fromId = computed(() => String(route.query.from || ''))

const card = computed(() => {
  dbState.cards.length
  return getCard(cardId.value)
})
const tabs = computed(() => {
  dbState.tabs.length
  return card.value ? listTabs(card.value.id) : []
})
const currentTab = computed(() => tabs.value.find((tab) => tab.id === activeTab.value) || tabs.value[0] || null)
const resources = computed(() => {
  dbState.videos.length
  return currentTab.value ? listVideos(currentTab.value.id) : []
})
const comments = computed(() => {
  dbState.comments.length
  return card.value ? visibleComments(card.value.id) : []
})
const preview = computed(() => comments.value[0] || null)
const likes = computed(() => {
  dbState.visit_events.length
  return card.value ? likeCount(card.value.id) : 0
})
const liked = computed(() => (card.value ? likedByMe(card.value.id) : false))
const returns = computed(() => {
  dbState.referral_edges.length
  return card.value ? childCards(card.value.id).length : 0
})
const returnFaces = computed(() =>
  card.value ? childCards(card.value.id).slice(0, 3).map((item) => item.avatar) : [],
)
const shareScene = computed(() => (scene.value === 'direct' ? card.value?.scene || 'home' : scene.value))
const meetingsOn = computed(() => {
  dbState.cards.length
  return card.value ? meetingsEnabled(card.value.id) : false
})
const meetingRows = computed(() => {
  dbState.meetings?.length
  if (!card.value || !meetingsOn.value) return []
  return listMeetings(card.value.id).filter((item) => item.status === 'ready')
})

watch(
  tabs,
  (list) => {
    if (!list.some((tab) => tab.id === activeTab.value)) activeTab.value = list[0]?.id || ''
  },
  { immediate: true },
)

watch(
  () => [cardId.value, scene.value, fromId.value],
  () => {
    if (!getCard(cardId.value)) return
    recordOpen(cardId.value, { scene: scene.value, from: fromId.value })
  },
  { immediate: true },
)

function toast(message) {
  toastMsg.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMsg.value = ''
  }, 1600)
}

function onContact() {
  if (!card.value) return
  addEvent(card.value.id, { type: 'contact_click', scene: scene.value, from: fromId.value })
  if (card.value.phone) window.location.href = `tel:${card.value.phone}`
}

function onLike() {
  if (!card.value) return
  toggleLike(card.value.id)
}

function openResource(item) {
  if (!card.value) return
  if (item.type === 'video' || item.type === 'live') {
    addEvent(card.value.id, { type: 'video_play', videoId: item.id, scene: scene.value })
    playing.value = item
    return
  }
  toast(`打开${typeLabel[item.type] || '内容'}：${item.title}`)
}

function onPlayerClose(seconds) {
  if (card.value && playing.value) {
    addEvent(card.value.id, {
      type: 'video_progress',
      videoId: playing.value.id,
      durationSec: seconds,
    })
  }
  playing.value = null
}

function sendComment() {
  if (!card.value || !draft.value.trim()) return
  addComment(card.value.id, draft.value)
  draft.value = ''
}

function goReturn() {
  router.push({
    path: '/auth',
    query: {
      card: card.value?.id || 'card_main',
      scene: shareScene.value,
      from: card.value?.id || 'card_main',
    },
  })
}

function goMenu(path) {
  menuOpen.value = false
  router.push(path)
}

function openShare() {
  menuOpen.value = false
  shareOpen.value = true
}
</script>

<style scoped>
.home {
  padding-bottom: calc(68px + env(safe-area-inset-bottom, 0px));
  min-height: 100%;
}
.mp-chrome {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px 8px 16px;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
.mp-title { font-size: 15px; font-weight: 500; }
.mp-actions {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  padding: 2px 4px;
  gap: 2px;
}
.mp-dot, .mp-close {
  width: 32px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #fff;
}
.menu-pop {
  position: absolute;
  right: 12px;
  top: 42px;
  background: #fff;
  color: #222;
  text-shadow: none;
  border-radius: 10px;
  min-width: 132px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}
.menu-pop button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  font-size: 14px;
  color: #222;
}
.banner {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}
.theme-poster .banner { height: 230px; }
.banner-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.15), transparent 40%);
}
.profile-card {
  margin: -48px 12px 0;
  background: #fff;
  border-radius: 14px;
  padding: 16px 16px 14px;
  position: relative;
  z-index: 5;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
.theme-light .profile-card {
  box-shadow: none;
  border: 1px solid #e6e6e6;
}
.profile-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.name { font-size: 18px; font-weight: 700; line-height: 1.3; margin-bottom: 6px; }
.phone { font-size: 22px; font-weight: 600; color: var(--blue-text); letter-spacing: 0.5px; }
.btn-contact {
  flex-shrink: 0;
  background: var(--navy);
  color: #fff;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  margin-top: 4px;
}
.profile-meta { display: flex; align-items: center; flex-wrap: wrap; margin-top: 12px; gap: 8px; }
.company { font-size: 13px; color: #555; }
.badge {
  flex-shrink: 0;
  font-size: 10px;
  color: #0d4f3c;
  background: #e5f6ee;
  border-radius: 8px;
  padding: 2px 6px;
}
.badge.firm { color: #1a3a6b; background: #e8eef8; }
.detail-btn { font-size: 12px; color: var(--navy); background: #f0f4fa; border-radius: 10px; padding: 2px 8px; margin-left: auto; }
.company-extra { margin-top: 8px; font-size: 12px; color: #888; line-height: 1.5; }
.company-extra p + p { margin-top: 4px; }
.city { margin-top: 10px; font-size: 13px; color: #666; }
.pin { font-size: 12px; }
.social-row { display: flex; align-items: center; gap: 8px; padding: 12px 12px 0; }
.pill {
  background: #fff;
  border-radius: 20px;
  padding: 7px 12px;
  font-size: 12px;
  color: #555;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  flex: 1;
  text-align: left;
}
.icon-btn {
  background: #fff;
  border-radius: 20px;
  padding: 7px 10px;
  font-size: 12px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 3px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  white-space: nowrap;
}
.icon-btn.active { color: #e74c3c; }
.ico { font-size: 13px; }
.comment-preview {
  margin: 10px 12px 0;
  background: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.c-avatar { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; background: #eee; }
.c-body {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  line-height: 1.4;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.c-name { color: #888; margin-right: 4px; }
.c-text { color: #333; }
.c-thumb { font-size: 12px; color: #888; flex-shrink: 0; }
.c-empty { font-size: 12px; color: #999; }
.meeting-entry { margin: 12px 12px 0; }
.meeting-head { font-size: 15px; margin-bottom: 8px; color: var(--navy); }
.meeting-row {
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;
  text-align: left;
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 8px;
}
.play-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1a4f9c;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 12px;
  padding-left: 2px;
}
.meeting-row strong { display: block; font-size: 14px; }
.meeting-row em { display: block; margin-top: 2px; font-style: normal; font-size: 12px; color: #888; }
.meeting-empty { font-size: 12px; color: #888; }
.tabs-wrap {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg);
  margin-top: 8px;
  border-bottom: 1px solid #e8e8e8;
}
.tabs { display: flex; overflow-x: auto; padding: 0 8px; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab {
  flex-shrink: 0;
  padding: 12px 14px 10px;
  font-size: 14px;
  color: #333;
  position: relative;
  white-space: nowrap;
}
.tab.active { color: var(--navy); font-weight: 600; }
.tab.active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 28px;
  height: 3px;
  background: var(--navy);
  border-radius: 2px;
}
.section-head {
  text-align: center;
  color: var(--navy);
  font-size: 14px;
  font-weight: 600;
  padding: 14px 0 8px;
  letter-spacing: 1px;
}
.resource-list { padding: 0 12px 16px; display: flex; flex-direction: column; gap: 8px; }
.resource-card {
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  gap: 12px;
  align-items: center;
}
.thumb {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.play {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: var(--navy);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  padding-left: 2px;
}
.type-badge { font-size: 11px; color: #fff; background: rgba(0, 0, 0, 0.35); padding: 2px 6px; border-radius: 4px; }
.res-body { flex: 1; min-width: 0; }
.res-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.res-meta { margin-top: 6px; font-size: 12px; color: #aaa; }
.empty-res, .missing { text-align: center; color: #888; font-size: 13px; padding: 24px 16px; }
.bottom-bar {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 100%;
  max-width: 375px;
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom, 0px));
  gap: 8px;
  z-index: 50;
}
.avatars { display: flex; flex-shrink: 0; }
.av { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #fff; background: #ddd; }
.return-text { flex: 1; font-size: 12px; color: var(--navy); font-weight: 500; line-height: 1.3; min-width: 0; }
.btn-return {
  flex-shrink: 0;
  background: var(--navy);
  color: #fff;
  border-radius: 22px;
  height: 40px;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 600;
}
.sheet-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.sheet-top button { color: var(--navy); }
.c-row { display: flex; gap: 8px; padding: 8px 0; border-bottom: 1px solid #f3f3f3; }
.c-row img { width: 32px; height: 32px; border-radius: 50%; background: #eee; }
.c-row b { font-size: 13px; }
.c-row p { font-size: 13px; color: #444; margin-top: 2px; }
.composer { display: flex; gap: 8px; margin-top: 12px; }
.composer .input { flex: 1; }
.composer .btn-navy { height: 40px; padding: 0 14px; }
</style>
