<template>
  <section v-if="!enabled" class="pad upsell">
    <p class="plan">{{ MEETING_PLAN.name }}</p>
    <p class="price">{{ MEETING_PLAN.priceText }}</p>
    <p class="note">当前这张名片还没开通。开通后，访客名片上才会出现会议入口。演示不会扣款。</p>
    <ul>
      <li v-for="item in MEETING_FEATURES" :key="item">{{ item }}</li>
    </ul>
    <button class="btn-navy stack-btn" type="button" @click="openAddon">开通会议录制</button>
  </section>

  <section v-else class="pad">
    <div class="tabs">
      <button type="button" :class="{ on: tab === 'list' }" @click="tab = 'list'">会议</button>
      <button type="button" :class="{ on: tab === 'cloud' }" @click="tab = 'cloud'">云盘</button>
      <button type="button" :class="{ on: tab === 'tickets' }" @click="tab = 'tickets'">举报</button>
      <button type="button" :class="{ on: tab === 'usage' }" @click="tab = 'usage'">用量</button>
    </div>

    <template v-if="tab === 'list'">
      <h2>创建会议</h2>
      <label class="field"><span>标题</span><input v-model="title" class="input" maxlength="40" placeholder="例如：经营例会" /></label>
      <div class="choices">
        <button type="button" :class="{ on: type === 'audio' }" @click="type = 'audio'">纯音频</button>
        <button type="button" :class="{ on: type === 'av' }" @click="type = 'av'">音视频</button>
      </div>
      <div class="choices">
        <button type="button" :class="{ on: recordMode === 'audio' }" @click="recordMode = 'audio'">仅录音频</button>
        <button type="button" :class="{ on: recordMode === 'mix' }" :disabled="type !== 'av'" @click="recordMode = 'mix'">音视频合流</button>
      </div>
      <button class="btn-navy stack-btn" type="button" @click="create">创建并得到会议号</button>
      <p v-if="created" class="fresh">会议 ID {{ created.code }}
        <button type="button" @click="enter(created)">进入</button>
      </p>

      <h2>用会议号加入</h2>
      <div class="join">
        <input v-model="code" class="input" inputmode="numeric" placeholder="6 位会议号" />
        <button type="button" @click="join">加入</button>
      </div>
      <p v-if="joinError" class="note">{{ joinError }}</p>

      <div class="filters">
        <button type="button" :class="{ on: filter === 'all' }" @click="filter = 'all'">全部</button>
        <button type="button" :class="{ on: filter === 'audio' }" @click="filter = 'audio'">纯音频</button>
        <button type="button" :class="{ on: filter === 'av' }" @click="filter = 'av'">音视频</button>
      </div>
      <article v-for="item in rows" :key="item.id" class="row">
        <div>
          <b>{{ item.title }}</b>
          <p>{{ item.type === 'av' ? '音视频' : '纯音频' }} · {{ item.code }} · {{ statusText(item) }}</p>
        </div>
        <div class="ops">
          <button v-if="item.status === 'ready'" type="button" @click="$router.push(`/meeting/${item.id}`)">回放</button>
          <button v-else-if="item.status !== 'closed'" type="button" @click="enter(item)">进入</button>
          <button type="button" @click="remove(item.id)">删除</button>
        </div>
      </article>
      <p v-if="!rows.length" class="note">这张名片还没有会议。</p>
    </template>

    <CloudDrive v-else-if="tab === 'cloud'" embedded />

    <template v-else-if="tab === 'tickets'">
      <label class="switch">
        <input type="checkbox" :checked="config.safety" @change="setProviderConfig({ safety: $event.target.checked })" />
        <span>内容安全告警</span>
      </label>
      <p class="note">告警只回调到超级名片自己的业务后端，由我们决定处置，不会把处置权交给会议供应商。</p>
      <article v-for="ticket in tickets" :key="ticket.id" class="row">
        <div>
          <b>{{ ticket.meetingTitle }}</b>
          <p>{{ ticket.reason }} · {{ ticket.reporterName }} · {{ ticketStatus(ticket.status) }}</p>
          <p>{{ ticket.alert }}</p>
          <p v-if="ticket.actionNote">{{ ticket.actionNote }}</p>
        </div>
        <div class="ops">
          <button type="button" @click="setTicketStatus(ticket.id, 'handled', '已标记处理（演示）')">处置</button>
          <button type="button" @click="setTicketStatus(ticket.id, 'archived', '已归档')">归档</button>
        </div>
      </article>
      <p v-if="!tickets.length" class="note">还没有举报工单。</p>
    </template>

    <template v-else>
      <p class="who">用量成本看板 · {{ report.label }} · 计价厂商 {{ report.providerName }}</p>
      <div class="choices">
        <button type="button" :class="{ on: config.costRtc === 'agora' }" @click="setProviderConfig({ costRtc: 'agora' })">声网</button>
        <button type="button" :class="{ on: config.costRtc === 'volc' }" @click="setProviderConfig({ costRtc: 'volc' })">火山</button>
      </div>
      <p class="note">房间仍由本地模拟。声网和火山适配器没有接线，这里只切换演示单价。</p>
      <div class="choices">
        <button type="button" :class="{ on: config.asrVendor === 'volc' }" @click="setProviderConfig({ asrVendor: 'volc' })">火山识别</button>
        <button type="button" :class="{ on: config.asrVendor === 'aliyun' }" @click="setProviderConfig({ asrVendor: 'aliyun' })">阿里云</button>
        <button type="button" :class="{ on: config.asrVendor === 'xfyun' }" @click="setProviderConfig({ asrVendor: 'xfyun' })">讯飞</button>
      </div>
      <p class="note">识别厂商未接入，转写仍用本地示例。</p>
      <article v-for="row in report.rows" :key="row.key" class="cost">
        <b>{{ row.name }}</b>
        <span>{{ row.usage }}</span>
        <em>{{ row.amountText }}</em>
      </article>
      <p class="total">合计 {{ report.totalText }}</p>
    </template>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import CloudDrive from '../CloudDrive.vue'
import {
  adminCardId,
  createMeeting,
  dbState,
  deleteMeeting,
  findMeeting,
  joinMeeting,
  listMeetings,
  listTickets,
  MEETING_FEATURES,
  MEETING_PLAN,
  meetingsEnabled,
  providerConfig,
  setMeetingsAddon,
  setProviderConfig,
  setTicketStatus,
  usageReport,
} from '../../services/api.js'

const router = useRouter()
const tab = ref('list')
const title = ref('')
const type = ref('audio')
const recordMode = ref('audio')
const code = ref('')
const created = ref(null)
const joinError = ref('')
const filter = ref('all')

const cardId = computed(() => {
  dbState.meta && dbState.meta.adminCardId
  dbState.cards.length
  return adminCardId()
})
const enabled = computed(() => meetingsEnabled(cardId.value))
const rows = computed(() => {
  dbState.meetings?.length
  return listMeetings(cardId.value).filter((item) => filter.value === 'all' || item.type === filter.value)
})
const tickets = computed(() => {
  dbState.tickets?.length
  return listTickets()
})
const config = computed(() => {
  dbState.meta && dbState.meta.costRtc
  dbState.meta && dbState.meta.safety
  dbState.meta && dbState.meta.asrVendor
  return providerConfig()
})
const report = computed(() => {
  dbState.meetings?.length
  config.value.costRtc
  return usageReport()
})

watch(type, (value) => {
  if (value !== 'av') recordMode.value = 'audio'
})

function openAddon() {
  setMeetingsAddon(cardId.value, true)
}

function create() {
  created.value = createMeeting({ title: title.value, type: type.value, recordMode: recordMode.value })
  title.value = ''
}

async function enter(item) {
  await joinMeeting(item.code)
  router.push(item.status === 'ready' ? `/meeting/${item.id}` : `/meeting/${item.id}/live`)
}

async function join() {
  joinError.value = ''
  const found = findMeeting(code.value)
  if (!found) {
    joinError.value = '没有这个会议号'
    return
  }
  if (found.status === 'ready') {
    router.push(`/meeting/${found.id}`)
    return
  }
  await joinMeeting(found.code)
  router.push(`/meeting/${found.id}/live`)
}

function remove(id) {
  deleteMeeting(id)
}

function statusText(item) {
  if (item.status === 'live') return '录制中'
  if (item.status === 'processing') return '生成中'
  if (item.status === 'ready') return '已生成'
  if (item.status === 'closed') return '已关闭'
  return '待开始'
}

function ticketStatus(status) {
  if (status === 'handled') return '已处置'
  if (status === 'archived') return '已归档'
  return '待查看'
}
</script>

<style scoped>
.upsell { background: #fff; margin: 12px; border-radius: 14px; }
.plan { font-size: 18px; font-weight: 700; }
.price { color: var(--navy); font-size: 16px; margin: 6px 0 8px; }
.upsell ul { padding-left: 18px; margin: 8px 0 14px; }
.upsell li { font-size: 13px; line-height: 1.55; }
.tabs { display: flex; gap: 6px; margin-bottom: 12px; }
.tabs button, .choices button, .filters button { flex: 1; height: 32px; border-radius: 16px; background: #fff; font-size: 13px; color: #555; }
.tabs .on, .choices .on, .filters .on { background: var(--navy); color: #fff; }
.choices, .filters, .join { display: flex; gap: 6px; margin-bottom: 10px; }
.choices button:disabled { opacity: 0.4; }
.join .input { flex: 1; }
.join button { color: #fff; background: var(--navy); border-radius: 10px; padding: 0 12px; }
h2 { font-size: 15px; margin: 12px 0 8px; }
.fresh { background: #e8eef8; border-radius: 10px; padding: 8px 10px; font-size: 14px; }
.fresh button, .ops button { color: var(--navy); margin-left: 8px; }
.row { background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 8px; }
.row p { font-size: 12px; color: #888; margin-top: 4px; }
.ops { margin-top: 6px; }
.switch { display: flex; gap: 8px; align-items: center; font-size: 14px; margin-bottom: 8px; }
.cost { display: grid; grid-template-columns: 1.2fr 1fr auto; gap: 8px; background: #fff; border-radius: 10px; padding: 10px 12px; margin-bottom: 6px; font-size: 13px; }
.cost em { font-style: normal; color: var(--navy); }
.total { margin-top: 8px; font-weight: 700; }
</style>
