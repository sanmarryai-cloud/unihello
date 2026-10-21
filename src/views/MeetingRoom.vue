<template>
  <div class="page room" v-if="meeting">
    <header class="subhead">
      <button type="button" class="back" @click="leave">‹</button>
      <span>会议中</span>
      <span class="spacer" />
    </header>

    <section v-if="meeting.status === 'ready' || meeting.status === 'closed'" class="pad">
      <p class="note">{{ meeting.status === 'ready' ? '这场已经生成回放。' : '房间已关闭。' }}</p>
      <button v-if="meeting.status === 'ready'" class="btn-navy stack-btn" type="button" @click="$router.push(`/meeting/${meeting.id}`)">查看回放</button>
    </section>

    <template v-else>
      <section class="pad head">
        <h1>{{ meeting.title }}</h1>
        <p>会议 ID {{ meeting.code }} · {{ meeting.type === 'av' ? '音视频' : '纯音频' }} · {{ meeting.recordMode === 'mix' ? '音视频合流' : '仅录音频' }}</p>
        <p class="rec">{{ meeting.recording ? '正在录音' : '未录音' }}</p>
      </section>

      <p v-if="meeting.type === 'av'" class="weak">当前网络较弱，已降低画面清晰度（演示）</p>

      <section v-if="meeting.type === 'av'" class="tiles">
        <div v-for="member in cameras" :key="member.id" class="tile">{{ member.name }}</div>
        <p v-if="!cameras.length" class="note empty">摄像头都关着。</p>
      </section>

      <section class="pad">
        <h2>成员</h2>
        <article v-for="member in meeting.participants" :key="member.id" class="member">
          <div>
            <b>{{ member.name }}</b>
            <p>{{ member.role === 'host' ? '主持人' : '成员' }} · {{ member.mic ? '麦克风开' : '已静音' }}<template v-if="meeting.type === 'av'"> · {{ member.camera ? '摄像头开' : '摄像头关' }}</template></p>
          </div>
          <button v-if="isHost && member.role !== 'host'" type="button" @click="kick(member.id)">移出</button>
        </article>
        <div class="controls">
          <button type="button" @click="toggleMic">{{ self?.mic ? '静音' : '开麦' }}</button>
          <button type="button" :disabled="meeting.type !== 'av'" @click="toggleCamera">{{ self?.camera ? '关摄像头' : '开摄像头' }}</button>
        </div>
        <div v-if="isHost" class="host">
          <button type="button" @click="mute">全员静音</button>
          <button type="button" @click="close">关闭房间</button>
        </div>
        <button class="btn-navy stack-btn end" type="button" @click="finish">结束会议</button>
        <button class="report" type="button" @click="reportOpen = true">举报</button>
      </section>
    </template>

    <div v-if="phase === 'generating'" class="mask">
      <b>录制已完成</b>
      <p>AI 生成中</p>
    </div>

    <div v-if="reportOpen" class="sheet-mask" @click.self="reportOpen = false">
      <div class="sheet">
        <strong>举报</strong>
        <button v-for="reason in reasons" :key="reason" type="button" class="reason" @click="sendReport(reason)">{{ reason }}</button>
      </div>
    </div>
  </div>
  <p v-else class="pad">没有这场会议。</p>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  closeRoom,
  createTicket,
  currentVisitorId,
  dbState,
  endMeeting,
  getMeeting,
  joinMeeting,
  kickMember,
  leaveMeeting,
  muteAll,
  setParticipantCamera,
  setParticipantMic,
} from '../services/api.js'

const route = useRoute()
const router = useRouter()
const phase = ref('')
const reportOpen = ref(false)
const reasons = ['不当内容', '骚扰', '其他']
let timer = null

const meeting = computed(() => {
  dbState.meetings?.length
  return getMeeting(String(route.params.id || ''))
})
const self = computed(() => meeting.value?.participants?.find((item) => item.id === currentVisitorId() || item.role === 'host') || null)
const isHost = computed(() => {
  const me = currentVisitorId()
  return !me || me === meeting.value?.hostId || meeting.value?.hostId === 'user_owner'
})
const cameras = computed(() => (meeting.value?.participants || []).filter((item) => item.camera))

onMounted(async () => {
  if (!meeting.value) return
  if (meeting.value.status === 'scheduled' || meeting.value.status === 'live') await joinMeeting(meeting.value.id)
})

async function toggleMic() {
  const member = self.value
  if (!member) return
  await setParticipantMic(meeting.value.id, member.id, !member.mic)
}

async function toggleCamera() {
  const member = self.value
  if (!member) return
  await setParticipantCamera(meeting.value.id, member.id, !member.camera)
}

async function kick(userId) {
  await kickMember(meeting.value.id, userId)
}

async function mute() {
  await muteAll(meeting.value.id)
}

async function close() {
  await closeRoom(meeting.value.id)
  router.push('/admin/meetings')
}

async function finish() {
  phase.value = 'generating'
  await endMeeting(meeting.value.id)
  timer = setTimeout(() => {
    router.replace(`/meeting/${meeting.value.id}`)
  }, 800)
}

async function leave() {
  await leaveMeeting(meeting.value.id)
  router.push('/admin/meetings')
}

function sendReport(reason) {
  createTicket({ meetingId: meeting.value.id, reason })
  reportOpen.value = false
}
</script>

<style scoped>
.back { font-size: 28px; width: 36px; color: #333; }
.spacer { width: 36px; }
.head h1 { font-size: 18px; }
.head p { font-size: 13px; color: #666; margin-top: 4px; }
.rec { color: #c0392b !important; }
.weak { margin: 0 12px 8px; background: #fff6e8; color: #8a5a12; border-radius: 10px; padding: 8px 10px; font-size: 12px; }
.tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 0 12px; }
.tile { height: 96px; border-radius: 12px; background: linear-gradient(160deg, #1a3a6b, #4a7fd4); color: #fff; display: flex; align-items: flex-end; padding: 8px; font-size: 13px; }
.empty { grid-column: 1 / -1; }
h2 { font-size: 15px; margin-bottom: 8px; }
.member { display: flex; justify-content: space-between; gap: 8px; background: #fff; border-radius: 12px; padding: 10px 12px; margin-bottom: 8px; align-items: center; }
.member p { font-size: 12px; color: #888; margin-top: 2px; }
.member button, .controls button, .host button, .report { color: var(--navy); font-size: 13px; }
.controls, .host { display: flex; gap: 8px; margin: 8px 0; }
.controls button, .host button { flex: 1; height: 36px; background: #fff; border-radius: 18px; }
.end { margin-top: 8px; }
.report { display: block; margin: 10px auto; }
.mask { position: fixed; inset: 0; background: rgba(12, 28, 58, 0.92); color: #fff; z-index: 90; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
.mask b { font-size: 20px; }
.reason { display: block; width: 100%; text-align: left; padding: 12px 0; border-bottom: 1px solid #f2f2f2; }
</style>
