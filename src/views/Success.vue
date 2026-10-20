<template>
  <div class="page success">
    <div class="mp-chrome">
      <button class="back" type="button" @click="backToParent">‹</button>
      <span class="mp-title">回递成功</span>
      <div class="spacer" />
    </div>

    <div class="body">
      <div class="check">✓</div>
      <h2>我的名片 创建成功</h2>
      <p class="sub">已向 {{ parent?.name || '对方' }} 回递，场景 {{ scene }}</p>

      <div class="card-preview" v-if="card">
        <img :src="card.avatar" class="av" alt="" />
        <div>
          <div class="n">{{ card.name }}</div>
          <div class="m">{{ card.phone }}</div>
        </div>
      </div>

      <button class="btn-navy full" type="button" @click="goShare">复制链接并分享</button>
      <button class="btn-ghost" type="button" @click="goMine">打开我的名片</button>
      <button class="btn-ghost" type="button" @click="backToParent">返回对方名片</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCard } from '../services/api.js'

const route = useRoute()
const router = useRouter()
const card = computed(() => getCard(String(route.query.card || '')))
const parent = computed(() => getCard(String(route.query.parent || 'card_main')))
const scene = computed(() => String(route.query.scene || 'return'))

function goShare() {
  router.push({ path: '/share', query: { card: card.value?.id, scene: scene.value } })
}
function goMine() {
  router.push({ path: '/my', query: { card: card.value?.id } })
}
function backToParent() {
  router.push({ path: '/', query: { card: parent.value?.id || 'card_main' } })
}
</script>

<style scoped>
.success { background: #fff; min-height: 100%; }
.mp-chrome { display: flex; align-items: center; padding: 12px 8px; border-bottom: 1px solid #f0f0f0; }
.back { font-size: 28px; width: 36px; color: #333; }
.mp-title { flex: 1; text-align: center; font-size: 16px; font-weight: 500; }
.spacer { width: 36px; }
.body { padding: 48px 28px; text-align: center; }
.check {
  width: 72px; height: 72px; border-radius: 50%;
  margin: 0 auto 16px; background: #e8f8ef; color: #07c160;
  font-size: 36px; line-height: 72px;
}
h2 { font-size: 20px; margin-bottom: 8px; }
.sub { color: #888; font-size: 13px; margin-bottom: 24px; }
.card-preview {
  display: flex; gap: 12px; align-items: center; text-align: left;
  background: #f7f8fa; border-radius: 12px; padding: 12px; margin-bottom: 24px;
}
.av { width: 48px; height: 48px; border-radius: 10px; background: #eee; }
.n { font-weight: 700; }
.m { margin-top: 4px; font-size: 13px; color: #888; }
.full { width: 100%; margin-bottom: 12px; }
.btn-ghost {
  width: 100%; height: 44px; color: #666; font-size: 14px; margin-bottom: 4px;
}
</style>
