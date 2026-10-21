<template>
  <div ref="root" class="player" :class="video ? 'is-video' : 'is-audio'">
    <video
      v-if="video"
      ref="media"
      :src="meeting.mediaUrl"
      playsinline
      preload="metadata"
      @timeupdate="emitTime"
      @loadedmetadata="onMeta"
      @ended="playing = false"
    />
    <audio
      v-else
      ref="media"
      :src="meeting.mediaUrl"
      preload="metadata"
      @timeupdate="emitTime"
      @loadedmetadata="onMeta"
      @ended="playing = false"
    />
    <canvas v-if="!video" ref="wave" class="wave" @pointerdown="onDrag" />
    <button v-if="!playing" class="center" type="button" @click="toggle">▶</button>
    <button v-else class="center pause" type="button" @click="toggle">❚❚</button>
    <div class="bar">
      <span>{{ formatClock(current) }}</span>
      <input
        class="scrub"
        type="range"
        min="0"
        :max="length"
        step="0.1"
        :value="current"
        @input="onRange"
      />
      <span>{{ formatClock(length) }}</span>
      <button type="button" @click="cycleRate">{{ rate }}x</button>
      <button type="button" @click="full">全屏</button>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { formatClock } from '../services/api.js'

const props = defineProps({
  meeting: { type: Object, required: true },
})
const emit = defineEmits(['time'])

const root = ref(null)
const media = ref(null)
const wave = ref(null)
const playing = ref(false)
const current = ref(0)
const length = ref(props.meeting.durationSec || 1)
const rate = ref(1)
const rates = [0.75, 1, 1.25, 1.5, 2]
const video = computed(() => props.meeting.mediaKind === 'video')

function emitTime() {
  current.value = media.value?.currentTime || 0
  emit('time', current.value)
  draw()
}

function onMeta() {
  if (media.value?.duration && Number.isFinite(media.value.duration)) length.value = media.value.duration
  draw()
}

function toggle() {
  const el = media.value
  if (!el) return
  if (el.paused) {
    el.playbackRate = rate.value
    el.play().then(() => {
      playing.value = true
    }).catch(() => {
      playing.value = false
    })
  } else {
    el.pause()
    playing.value = false
  }
}

function seek(sec) {
  const el = media.value
  if (!el) return
  const next = Math.max(0, Math.min(Number(sec) || 0, length.value || props.meeting.durationSec || 0))
  el.currentTime = next
  current.value = next
  emit('time', next)
  draw()
}

function onRange(event) {
  seek(Number(event.target.value))
}

function onDrag(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
  seek(ratio * length.value)
  const move = (point) => {
    const box = event.currentTarget.getBoundingClientRect()
    const next = Math.min(1, Math.max(0, (point.clientX - box.left) / box.width))
    seek(next * length.value)
  }
  const up = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
}

function cycleRate() {
  const index = rates.indexOf(rate.value)
  rate.value = rates[(index + 1) % rates.length]
  if (media.value) media.value.playbackRate = rate.value
}

function full() {
  const node = root.value
  if (!node) return
  if (document.fullscreenElement) document.exitFullscreen?.()
  else node.requestFullscreen?.()
}

function draw() {
  const canvas = wave.value
  if (!canvas || video.value) return
  const width = canvas.clientWidth || 320
  const height = 96
  const dpr = 2
  canvas.width = width * dpr
  canvas.height = height * dpr
  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)
  const peaks = props.meeting.peaks?.length ? props.meeting.peaks : [0.4, 0.7, 0.3, 0.8]
  const gap = 2
  const bar = Math.max(2, (width - gap * peaks.length) / peaks.length)
  const progress = length.value ? current.value / length.value : 0
  peaks.forEach((peak, index) => {
    const h = 8 + peak * (height - 16)
    const x = index * (bar + gap)
    ctx.fillStyle = index / peaks.length < progress ? '#9ec1ff' : 'rgba(255,255,255,.38)'
    ctx.fillRect(x, (height - h) / 2, bar, h)
  })
}

onMounted(() => nextTick(draw))
watch(() => props.meeting.id, () => nextTick(draw))

defineExpose({ seek, toggle })
</script>

<style scoped>
.player {
  position: relative;
  margin: 0 12px;
  border-radius: 16px;
  overflow: hidden;
  background: #0c2344;
  color: #fff;
}
.player:fullscreen,
.player:-webkit-full-screen {
  margin: 0;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
video {
  width: 100%;
  max-height: 280px;
  background: #000;
  display: block;
}
.wave {
  width: 100%;
  height: 96px;
  display: block;
  touch-action: none;
}
.center {
  position: absolute;
  left: 50%;
  top: 42px;
  transform: translateX(-50%);
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94);
  color: #1a3a6b;
  font-size: 18px;
}
.is-video .center { top: 38%; }
.center.pause { font-size: 14px; letter-spacing: 1px; }
.bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px 12px;
  font-size: 12px;
}
.scrub { flex: 1; min-width: 0; accent-color: #9ec1ff; }
.bar button {
  color: #d7e6ff;
  font-size: 12px;
  padding: 4px 6px;
}
</style>
