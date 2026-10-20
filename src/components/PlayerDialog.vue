<template>
  <div class="sheet-mask" @click.self="close">
    <div class="sheet player-sheet">
      <div class="sheet-head">
        <strong>{{ video?.title }}</strong>
        <button type="button" @click="close">关闭</button>
      </div>
      <video
        v-if="!media.hls && media.url"
        ref="el"
        class="player"
        :src="media.url"
        playsinline
        controls
        autoplay
        @timeupdate="onTime"
      />
      <div v-else class="hls-stub">
        <p v-if="media.hls">m3u8 直播流只做占位，当前页面播放 mp4。</p>
        <p v-else>这条还没有片源。可在名片管理里上传，或先看带示例 mp4 的视频。</p>
      </div>
      <p v-if="media.signed" class="sign-line">防盗链签名（演示，不拦截播放）：{{ shortSign }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { resolveMedia } from '../services/api.js'

const props = defineProps({
  video: { type: Object, required: true },
})
const emit = defineEmits(['close'])
const el = ref(null)
const played = ref(0)
const media = computed(() => resolveMedia(props.video))
const shortSign = computed(() => (media.value.signedUrl || '').slice(-48))

function onTime(event) {
  played.value = event.target.currentTime || 0
}

function close() {
  const fromEl = el.value?.currentTime || played.value || 0
  emit('close', Math.round(fromEl))
}
</script>

<style scoped>
.sheet-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.sheet-head strong {
  font-size: 15px;
  line-height: 1.4;
}
.sheet-head button {
  color: var(--navy);
  font-size: 14px;
}
.player {
  width: 100%;
  border-radius: 10px;
  background: #000;
  max-height: 220px;
}
.hls-stub {
  background: #f6f7f9;
  border-radius: 10px;
  padding: 28px 16px;
  text-align: center;
  color: #666;
  font-size: 13px;
  line-height: 1.6;
}
.sign-line {
  margin-top: 8px;
  font-size: 11px;
  color: #999;
  word-break: break-all;
}
</style>
