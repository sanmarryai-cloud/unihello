<template>
  <div class="page home">
    <!-- WeChat mini-program chrome -->
    <div class="mp-chrome">
      <span class="mp-title">超级名片</span>
      <div class="mp-actions">
        <span class="mp-dot">···</span>
        <span class="mp-close">○</span>
      </div>
    </div>

    <!-- Banner -->
    <div class="banner" :style="{ backgroundImage: `url(${owner.banner})` }">
      <div class="banner-mask" />
    </div>

    <!-- Floating profile card -->
    <div class="profile-card">
      <div class="profile-top">
        <div class="profile-info">
          <h1 class="name">{{ owner.name }}</h1>
          <a class="phone" :href="`tel:${owner.phone}`">{{ owner.phone }}</a>
        </div>
        <button class="btn-contact" @click="onContact">联系Ta</button>
      </div>
      <div class="profile-meta">
        <span class="company">{{ owner.company }}</span>
        <button class="detail-btn" @click="showCompany = !showCompany">
          详情 {{ showCompany ? '▲' : '▼' }}
        </button>
      </div>
      <p v-if="showCompany" class="company-extra">
        专注 AI 私域获客与内容增长，服务中小企业数字化转型。
      </p>
      <div class="city">
        <span class="pin">📍</span> {{ owner.city }}
      </div>
    </div>

    <!-- Social row -->
    <div class="social-row">
      <button class="pill like-pill" @click="liked = !liked">
        {{ liked ? owner.likeCount + 1 : owner.likeCount }} 人 觉得名片好看
      </button>
      <button class="icon-btn" @click="toast('评论功能演示中')">
        <span class="ico">💬</span> 评论
      </button>
      <button class="icon-btn" :class="{ active: liked }" @click="liked = !liked">
        <span class="ico">{{ liked ? '❤️' : '🤍' }}</span> 点赞
      </button>
    </div>

    <!-- Comment preview -->
    <div class="comment-preview" @click="toast('查看全部评论')">
      <img :src="owner.commentPreview.avatar" class="c-avatar" alt="" />
      <div class="c-body">
        <span class="c-name">{{ owner.commentPreview.nickname }}</span>
        <span class="c-text">{{ owner.commentPreview.text }}</span>
      </div>
      <span class="c-thumb">👍</span>
    </div>

    <!-- Tabs -->
    <div class="tabs-wrap">
      <div class="tabs" ref="tabsEl">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- Resource list -->
    <div class="section-head">— {{ currentTab?.name }} —</div>
    <div class="resource-list">
      <div
        v-for="item in currentTab?.resources || []"
        :key="item.id"
        class="resource-card"
        @click="openResource(item)"
      >
        <div class="thumb" :style="{ background: item.thumb }">
          <span v-if="item.type === 'video' || item.type === 'audio'" class="play">▶</span>
          <span v-else class="type-badge">{{ typeLabel[item.type] }}</span>
        </div>
        <div class="res-body">
          <div class="res-title">{{ item.title }}</div>
          <div class="res-meta">{{ item.size }}</div>
        </div>
      </div>
    </div>

    <!-- Sticky bottom bar -->
    <div class="bottom-bar">
      <div class="avatars">
        <img
          v-for="(a, i) in owner.returnAvatars"
          :key="i"
          :src="a"
          class="av"
          :style="{ zIndex: 3 - i, marginLeft: i ? '-8px' : '0' }"
          alt=""
        />
      </div>
      <span class="return-text">{{ owner.returnCount }}人 已回递Ta的同款名片</span>
      <button class="btn-return" @click="goReturn">立即回递</button>
    </div>

    <div v-if="toastMsg" class="toast">{{ toastMsg }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { cardOwner, tabs, typeLabel } from '../data/mock.js'

const router = useRouter()
const owner = cardOwner
const activeTab = ref(tabs[0].id)
const liked = ref(false)
const showCompany = ref(false)
const toastMsg = ref('')
let toastTimer = null

const currentTab = computed(() => tabs.find((t) => t.id === activeTab.value))

function toast(msg) {
  toastMsg.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toastMsg.value = ''), 1800)
}

function onContact() {
  toast(`拨打 ${owner.phone}`)
}

function openResource(item) {
  toast(`打开${typeLabel[item.type] || '资源'}：${item.title.slice(0, 16)}…`)
}

function goReturn() {
  router.push('/auth')
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
.mp-title {
  font-size: 15px;
  font-weight: 500;
}
.mp-actions {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  padding: 2px 4px;
  gap: 2px;
}
.mp-dot,
.mp-close {
  width: 32px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  opacity: 0.95;
}

.banner {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}
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
.profile-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.name {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 6px;
}
.phone {
  font-size: 22px;
  font-weight: 600;
  color: var(--blue-text);
  letter-spacing: 0.5px;
}
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
.profile-meta {
  display: flex;
  align-items: center;
  margin-top: 12px;
  gap: 8px;
}
.company {
  font-size: 13px;
  color: #555;
}
.detail-btn {
  font-size: 12px;
  color: var(--navy);
  background: #f0f4fa;
  border-radius: 10px;
  padding: 2px 8px;
}
.company-extra {
  margin-top: 8px;
  font-size: 12px;
  color: #888;
  line-height: 1.5;
}
.city {
  margin-top: 10px;
  font-size: 13px;
  color: #666;
}
.pin {
  font-size: 12px;
}

.social-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 12px 0;
}
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
.icon-btn.active {
  color: #e74c3c;
}
.ico {
  font-size: 13px;
}

.comment-preview {
  margin: 10px 12px 0;
  background: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.c-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  background: #eee;
}
.c-body {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  line-height: 1.4;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.c-name {
  color: #888;
  margin-right: 4px;
}
.c-text {
  color: #333;
}
.c-thumb {
  font-size: 14px;
  flex-shrink: 0;
}

.tabs-wrap {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg);
  margin-top: 8px;
  border-bottom: 1px solid #e8e8e8;
}
.tabs {
  display: flex;
  overflow-x: auto;
  padding: 0 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.tabs::-webkit-scrollbar {
  display: none;
}
.tab {
  flex-shrink: 0;
  padding: 12px 14px 10px;
  font-size: 14px;
  color: #333;
  position: relative;
  white-space: nowrap;
}
.tab.active {
  color: var(--navy);
  font-weight: 600;
}
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

.resource-list {
  padding: 0 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.resource-card {
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  gap: 12px;
  align-items: center;
}
.resource-card:active {
  background: #fafafa;
}
.thumb {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}
.type-badge {
  font-size: 11px;
  color: #fff;
  background: rgba(0, 0, 0, 0.35);
  padding: 2px 6px;
  border-radius: 4px;
}
.res-body {
  flex: 1;
  min-width: 0;
}
.res-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.res-meta {
  margin-top: 6px;
  font-size: 12px;
  color: #aaa;
}

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
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
}
.avatars {
  display: flex;
  flex-shrink: 0;
}
.av {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: #ddd;
}
.return-text {
  flex: 1;
  font-size: 12px;
  color: var(--navy);
  font-weight: 500;
  line-height: 1.3;
  min-width: 0;
}
.btn-return {
  flex-shrink: 0;
  background: var(--navy);
  color: #fff;
  border-radius: 22px;
  height: 40px;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}
.btn-return:active {
  opacity: 0.9;
}
</style>
