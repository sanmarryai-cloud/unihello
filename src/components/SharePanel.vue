<template>
  <div class="share-panel">
    <p class="lead">把链接发给对方。对方打开后会带上 scene 和 from，回递时记到推荐关系里。</p>
    <div class="link-box">{{ link }}</div>
    <button class="btn-navy full" type="button" @click="copy">复制链接</button>
    <div class="qr-wrap">
      <div class="qr" aria-hidden="true">
        <span v-for="(on, i) in cells" :key="i" :class="{ on }" />
      </div>
      <p>二维码占位（演示，不能扫）</p>
    </div>
    <p v-if="copied" class="copied">已复制</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { shareLink } from '../services/api.js'

const props = defineProps({
  cardId: { type: String, required: true },
  scene: { type: String, default: 'share' },
})
const copied = ref(false)
const link = computed(() => shareLink(props.cardId, props.scene || 'share'))
const cells = computed(() => {
  const source = link.value || 'card'
  return Array.from({ length: 49 }, (_, index) => (source.charCodeAt(index % source.length) + index * 3) % 5 > 1)
})

async function copy() {
  try {
    await navigator.clipboard.writeText(link.value)
  } catch {
    const input = document.createElement('textarea')
    input.value = link.value
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    input.remove()
  }
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1600)
}
</script>

<style scoped>
.lead {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 10px;
}
.link-box {
  background: #f6f7f9;
  border-radius: 10px;
  padding: 10px;
  font-size: 12px;
  line-height: 1.45;
  word-break: break-all;
  margin-bottom: 12px;
}
.full {
  width: 100%;
}
.qr-wrap {
  margin-top: 16px;
  text-align: center;
}
.qr {
  width: 140px;
  height: 140px;
  margin: 0 auto 8px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  padding: 8px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
}
.qr span {
  background: #f2f2f2;
  border-radius: 1px;
}
.qr span.on {
  background: #1a3a6b;
}
.qr-wrap p,
.copied {
  font-size: 12px;
  color: #888;
}
.copied {
  margin-top: 8px;
  color: var(--navy);
}
</style>
