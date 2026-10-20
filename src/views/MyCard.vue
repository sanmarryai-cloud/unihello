<template>
  <div class="page my-card">
    <div class="mp-chrome">
      <button class="back" @click="$router.push('/')">‹</button>
      <span class="mp-title">我的名片</span>
      <div class="spacer" />
    </div>

    <div class="banner stub-banner" />

    <div class="profile-card" v-if="profile">
      <div class="profile-top">
        <img :src="profile.avatar" class="big-av" alt="" />
        <div class="info">
          <h1 class="name">{{ profile.nickname }}</h1>
          <p class="phone stub">点击填写手机号</p>
        </div>
        <button class="btn-contact" @click="toast('编辑名片（演示）')">编辑</button>
      </div>
      <div class="profile-meta">
        <span class="company">待完善公司信息</span>
      </div>
      <div class="city">📍 待设置城市</div>
    </div>

    <div class="stub-box">
      <p class="stub-title">名片内容（演示占位）</p>
      <ul>
        <li>可添加资源分类与素材</li>
        <li>可上传封面图、产品介绍</li>
        <li>分享后他人可回递名片</li>
      </ul>
      <p class="hint">真实产品会对接微信开放能力与后端存储</p>
    </div>

    <div class="actions">
      <button class="btn-navy full" @click="$router.push('/')">查看对方名片</button>
      <button class="btn-outline" @click="reset">重新授权创建</button>
    </div>

    <div v-if="toastMsg" class="toast">{{ toastMsg }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const profile = ref(null)
const toastMsg = ref('')
let t = null

onMounted(() => {
  const raw = localStorage.getItem('super-card-profile')
  if (!raw) {
    router.replace('/auth')
    return
  }
  profile.value = JSON.parse(raw)
})

function toast(msg) {
  toastMsg.value = msg
  clearTimeout(t)
  t = setTimeout(() => (toastMsg.value = ''), 1600)
}

function reset() {
  localStorage.removeItem('super-card-profile')
  router.replace('/auth')
}
</script>

<style scoped>
.my-card {
  background: var(--bg);
  min-height: 100%;
  padding-bottom: 40px;
}
.mp-chrome {
  display: flex;
  align-items: center;
  padding: 12px 8px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 10;
}
.back {
  font-size: 28px;
  width: 36px;
  color: #333;
}
.mp-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}
.spacer {
  width: 36px;
}

.stub-banner {
  height: 140px;
  background: linear-gradient(135deg, #1a3a6b 0%, #4a7fd4 50%, #e8a87c 100%);
}
.profile-card {
  margin: -40px 12px 0;
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  position: relative;
  z-index: 5;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
.profile-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.big-av {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  background: #eee;
}
.info {
  flex: 1;
  min-width: 0;
}
.name {
  font-size: 18px;
  font-weight: 700;
}
.phone.stub {
  margin-top: 6px;
  font-size: 14px;
  color: #bbb;
}
.btn-contact {
  background: var(--navy);
  color: #fff;
  border-radius: 20px;
  padding: 8px 14px;
  font-size: 13px;
  flex-shrink: 0;
}
.profile-meta {
  margin-top: 12px;
  font-size: 13px;
  color: #888;
}
.city {
  margin-top: 8px;
  font-size: 13px;
  color: #666;
}

.stub-box {
  margin: 16px 12px;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}
.stub-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--navy);
}
ul {
  padding-left: 18px;
  font-size: 13px;
  color: #555;
  line-height: 1.8;
}
.hint {
  margin-top: 12px;
  font-size: 11px;
  color: #bbb;
}

.actions {
  padding: 8px 24px 24px;
}
.full {
  width: 100%;
  margin-bottom: 12px;
}
.btn-outline {
  width: 100%;
  height: 44px;
  border: 1px solid #ddd;
  border-radius: 24px;
  color: #666;
  font-size: 14px;
}
</style>
