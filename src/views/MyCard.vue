<template>
  <div class="page my-card">
    <div class="mp-chrome">
      <button class="back" type="button" @click="$router.push('/')">‹</button>
      <span class="mp-title">我的名片</span>
      <div class="spacer" />
    </div>

    <template v-if="card">
      <div class="banner stub-banner" />
      <div class="profile-card">
        <div class="profile-top">
          <img :src="card.avatar" class="big-av" alt="" />
          <div class="info">
            <h1 class="name">{{ card.name }}</h1>
            <p class="phone">{{ card.phone || '未留手机' }}</p>
          </div>
        </div>
        <div class="city">来自 {{ parent?.name || '直接访问' }} · scene {{ card.scene || 'direct' }}</div>
      </div>

      <section class="form">
        <label class="field"><span>姓名</span><input v-model="form.name" class="input" /></label>
        <label class="field"><span>手机</span><input v-model="form.phone" class="input" /></label>
        <label class="field"><span>公司</span><input v-model="form.company" class="input" placeholder="选填" /></label>
        <label class="field"><span>城市</span><input v-model="form.city" class="input" placeholder="选填" /></label>
        <button class="btn-navy full" type="button" @click="save">保存</button>
        <button class="btn-outline" type="button" @click="share">分享我的名片</button>
        <button class="btn-outline" type="button" @click="preview">访客看到的页面</button>
      </section>
      <p v-if="saved" class="hint">已保存到本机。</p>
    </template>

    <div v-else class="form">
      <p class="hint">你还没有自己的名片。</p>
      <button class="btn-navy full" type="button" @click="$router.push({ path: '/auth', query: { card: 'card_main', scene: 'home', from: 'card_main' } })">
        立即回递并创建
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCard, myCard, updateCard } from '../services/api.js'

const route = useRoute()
const router = useRouter()
const saved = ref(false)
const form = reactive({ name: '', phone: '', company: '', city: '' })

const card = computed(() => getCard(String(route.query.card || '')) || myCard())
const parent = computed(() => (card.value?.parentCardId ? getCard(card.value.parentCardId) : null))

watch(
  card,
  (value) => {
    if (!value) return
    form.name = value.name || ''
    form.phone = value.phone || ''
    form.company = value.company || ''
    form.city = value.city || ''
  },
  { immediate: true },
)

function save() {
  if (!card.value) return
  updateCard(card.value.id, { ...form })
  saved.value = true
}
function share() {
  router.push({ path: '/share', query: { card: card.value.id, scene: card.value.scene || 'share' } })
}
function preview() {
  router.push({ path: '/', query: { card: card.value.id, scene: card.value.scene || 'share', from: card.value.parentCardId || card.value.id } })
}
</script>

<style scoped>
.my-card { background: var(--bg); min-height: 100%; padding-bottom: 28px; }
.mp-chrome {
  display: flex; align-items: center; padding: 12px 8px; background: #fff;
  border-bottom: 1px solid #f0f0f0; position: sticky; top: 0; z-index: 10;
}
.back { font-size: 28px; width: 36px; color: #333; }
.mp-title { flex: 1; text-align: center; font-size: 16px; font-weight: 500; }
.spacer { width: 36px; }
.stub-banner { height: 120px; background: linear-gradient(135deg, #1a3a6b, #4a7fd4 55%, #e8a87c); }
.profile-card {
  margin: -36px 12px 0; background: #fff; border-radius: 14px; padding: 16px; position: relative; z-index: 2;
}
.profile-top { display: flex; gap: 12px; align-items: center; }
.big-av { width: 56px; height: 56px; border-radius: 10px; background: #eee; }
.name { font-size: 18px; font-weight: 700; }
.phone { margin-top: 4px; color: var(--blue-text); font-size: 14px; }
.city { margin-top: 10px; font-size: 12px; color: #888; }
.form { padding: 16px 12px; }
.full { width: 100%; margin-bottom: 10px; }
.btn-outline {
  width: 100%; height: 42px; border: 1px solid #ddd; border-radius: 22px; color: #555; margin-bottom: 10px;
}
.hint { text-align: center; color: #888; font-size: 12px; padding: 0 16px 16px; }
</style>
