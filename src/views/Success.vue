<template>
  <div class="page success">
    <div class="mp-chrome">
      <button class="back" @click="$router.push('/')">‹</button>
      <span class="mp-title">回递成功</span>
      <div class="spacer" />
    </div>

    <div class="body">
      <div class="check">✓</div>
      <h2>我的名片 创建成功</h2>
      <p class="sub">已向 {{ ownerName }} 回递同款名片</p>

      <div class="card-preview" v-if="profile">
        <img :src="profile.avatar" class="av" alt="" />
        <div>
          <div class="n">{{ profile.nickname }}</div>
          <div class="m">点击下方查看我的名片</div>
        </div>
      </div>

      <button class="btn-navy full" @click="$router.push('/my')">打开我的名片</button>
      <button class="btn-ghost" @click="$router.push('/')">返回对方名片</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { cardOwner } from '../data/mock.js'

const router = useRouter()
const profile = ref(null)
const ownerName = cardOwner.name

onMounted(() => {
  const raw = localStorage.getItem('super-card-profile')
  if (!raw) {
    router.replace('/auth')
    return
  }
  profile.value = JSON.parse(raw)
})
</script>

<style scoped>
.success {
  background: #fff;
  min-height: 100%;
}
.mp-chrome {
  display: flex;
  align-items: center;
  padding: 12px 8px;
  border-bottom: 1px solid #f0f0f0;
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

.body {
  padding: 48px 28px;
  text-align: center;
}
.check {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #07c160;
  color: #fff;
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-weight: 700;
}
h2 {
  font-size: 20px;
  margin-bottom: 8px;
}
.sub {
  font-size: 13px;
  color: #888;
  margin-bottom: 28px;
}

.card-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f7f8fa;
  border-radius: 12px;
  padding: 14px;
  text-align: left;
  margin-bottom: 28px;
}
.av {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #eee;
}
.n {
  font-size: 16px;
  font-weight: 600;
}
.m {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.full {
  width: 100%;
  margin-bottom: 12px;
}
.btn-ghost {
  width: 100%;
  height: 44px;
  color: var(--navy);
  font-size: 15px;
  border: 1px solid #d0d8e8;
  border-radius: 24px;
}
</style>
