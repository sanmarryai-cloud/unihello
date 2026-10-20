<template>
  <div class="page">
    <header class="subhead">
      <button type="button" class="back" @click="$router.back()">‹</button>
      <span>名片海报</span>
      <span class="spacer" />
    </header>
    <section class="pad" v-if="card">
      <div class="themes">
        <button type="button" :class="{ on: theme === 'daily' }" @click="theme = 'daily'">每日动态</button>
        <button type="button" :class="{ on: theme === 'festival' }" @click="theme = 'festival'">节日</button>
      </div>
      <canvas ref="canvasEl" class="board" />
      <button class="btn-navy stack-btn" type="button" @click="download">下载图片</button>
      <button class="btn-line" type="button" @click="copyMoments">复制朋友圈文案</button>
      <p class="note">{{ copied }}</p>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCard, myCard, shareLink } from '../services/api.js'

const route = useRoute()
const canvasEl = ref(null)
const theme = ref('daily')
const copied = ref('二维码是占位图案，不能扫。')
const card = computed(() => getCard(String(route.query.card || '')) || myCard() || getCard('card_main'))

function paint() {
  const canvas = canvasEl.value
  const current = card.value
  if (!canvas || !current) return
  const width = 320
  const height = 480
  canvas.width = width * 2
  canvas.height = height * 2
  const ctx = canvas.getContext('2d')
  ctx.setTransform(2, 0, 0, 2, 0, 0)
  const colors = theme.value === 'festival' ? ['#8c1c13', '#e07a3d'] : ['#1a3a6b', '#4a7fd4']
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, colors[0])
  gradient.addColorStop(1, colors[1])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  const initial = (current.name || '名').slice(0, 1)
  ctx.beginPath()
  ctx.arc(58, 108, 28, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()
  ctx.fillStyle = colors[0]
  ctx.font = 'bold 24px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(initial, 58, 116)
  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(255,255,255,.92)'
  ctx.font = '14px sans-serif'
  const headline = theme.value === 'festival' ? '节日问候' : '今日动态'
  const day = new Date()
  ctx.fillText(`${headline} · ${day.getMonth() + 1}月${day.getDate()}日`, 100, 104)
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 28px sans-serif'
  ctx.fillText(current.name || '超级名片', 20, 160)
  ctx.font = '16px sans-serif'
  ctx.fillText(current.company || '超级名片科技', 20, 196)
  ctx.fillText(current.phone || '', 20, 224)
  ctx.fillText(current.city || '', 20, 250)
  ctx.fillStyle = '#fff'
  ctx.fillRect(20, 320, 110, 110)
  for (let index = 0; index < 64; index += 1) {
    if ((index * 7 + current.name.length) % 3 === 0) continue
    const x = 28 + (index % 8) * 12
    const y = 328 + Math.floor(index / 8) * 12
    ctx.fillStyle = '#1a3a6b'
    ctx.fillRect(x, y, 8, 8)
  }
  ctx.fillStyle = 'rgba(255,255,255,.9)'
  ctx.font = '12px sans-serif'
  ctx.fillText('扫码占位 · 超级名片', 20, 456)
}

function download() {
  const link = document.createElement('a')
  link.href = canvasEl.value.toDataURL('image/png')
  link.download = '超级名片海报.png'
  link.click()
}

async function copyMoments() {
  const current = card.value
  const text = `${current.name}｜${current.company}\n这是我的超级名片，点开就能看介绍。\n${shareLink(current.id, 'moments')}`
  try {
    await navigator.clipboard.writeText(text)
    copied.value = '朋友圈文案已复制'
  } catch {
    copied.value = text
  }
}

onMounted(() => nextTick(paint))
watch([theme, card], () => nextTick(paint))
</script>

<style scoped>
.back { font-size: 28px; width: 36px; }
.spacer { width: 36px; }
.themes { display: flex; gap: 8px; margin-bottom: 12px; }
.themes button { flex: 1; height: 36px; border-radius: 18px; background: #fff; }
.themes .on { background: var(--navy); color: #fff; }
.board { width: 100%; border-radius: 12px; background: #ddd; }
.btn-line {
  width: 100%;
  margin-top: 8px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid var(--navy);
  color: var(--navy);
}
</style>
