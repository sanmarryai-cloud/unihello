<template>
  <div class="page auth">
    <div class="mp-chrome dark">
      <button class="back" @click="$router.back()">‹</button>
      <span class="mp-title">微信授权</span>
      <div class="mp-actions">
        <span class="mp-dot">···</span>
        <span class="mp-close">○</span>
      </div>
    </div>

    <div class="auth-body">
      <div class="wx-logo">
        <svg viewBox="0 0 64 64" width="64" height="64">
          <circle cx="32" cy="32" r="32" fill="#07c160" />
          <text x="32" y="40" text-anchor="middle" fill="#fff" font-size="22" font-family="sans-serif">微</text>
        </svg>
      </div>
      <h2>超级名片 申请使用</h2>
      <p class="desc">获取你的昵称、头像用于创建「我的名片」</p>

      <div class="preview-card">
        <img :src="avatar" class="avatar" alt="" />
        <div>
          <div class="nick-label">昵称</div>
          <input v-model="nickname" class="nick-input" maxlength="20" placeholder="请输入昵称" />
        </div>
      </div>

      <div class="avatar-row">
        <span class="label">换个头像</span>
        <button
          v-for="(a, i) in avatars"
          :key="i"
          class="av-opt"
          :class="{ selected: avatar === a }"
          @click="avatar = a"
        >
          <img :src="a" alt="" />
        </button>
      </div>

      <button class="btn-agree" :disabled="loading || !nickname.trim()" @click="agree">
        {{ loading ? '授权中…' : '同意授权并回递名片' }}
      </button>
      <button class="btn-cancel" @click="$router.back()">拒绝</button>

      <p class="tip">演示环境：不接真实微信 API，本地模拟授权</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const avatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=me1&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=me2&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=me3&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=me4&backgroundColor=ffd5dc',
]
const avatar = ref(avatars[0])
const nickname = ref('微信用户')
const loading = ref(false)

function agree() {
  if (!nickname.value.trim()) return
  loading.value = true
  const profile = {
    nickname: nickname.value.trim(),
    avatar: avatar.value,
    createdAt: Date.now(),
  }
  localStorage.setItem('super-card-profile', JSON.stringify(profile))
  setTimeout(() => {
    loading.value = false
    router.replace('/success')
  }, 800)
}
</script>

<style scoped>
.auth {
  background: #fff;
  min-height: 100%;
  padding-bottom: 40px;
}
.mp-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 12px 8px;
  border-bottom: 1px solid #f0f0f0;
}
.mp-chrome.dark {
  color: #333;
}
.back {
  font-size: 28px;
  width: 36px;
  line-height: 1;
  color: #333;
}
.mp-title {
  font-size: 16px;
  font-weight: 500;
  flex: 1;
  text-align: center;
}
.mp-actions {
  display: flex;
  background: #f5f5f5;
  border-radius: 16px;
  padding: 2px;
}
.mp-dot,
.mp-close {
  width: 32px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
}

.auth-body {
  padding: 32px 24px;
  text-align: center;
}
.wx-logo {
  margin-bottom: 16px;
}
h2 {
  font-size: 18px;
  margin-bottom: 8px;
}
.desc {
  font-size: 13px;
  color: #888;
  margin-bottom: 28px;
}

.preview-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #f7f8fa;
  border-radius: 12px;
  padding: 14px 16px;
  text-align: left;
  margin-bottom: 20px;
}
.avatar {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  background: #eee;
}
.nick-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}
.nick-input {
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  outline: none;
  color: #1a1a1a;
}

.avatar-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.label {
  font-size: 13px;
  color: #888;
  width: 100%;
  text-align: left;
  margin-bottom: 4px;
}
.av-opt {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
}
.av-opt.selected {
  border-color: var(--navy);
}
.av-opt img {
  width: 100%;
  height: 100%;
}

.btn-agree {
  width: 100%;
  height: 48px;
  background: #07c160;
  color: #fff;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}
.btn-agree:disabled {
  opacity: 0.6;
}
.btn-cancel {
  width: 100%;
  height: 44px;
  color: #888;
  font-size: 15px;
}
.tip {
  margin-top: 24px;
  font-size: 11px;
  color: #bbb;
}
</style>
