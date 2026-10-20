<template>
  <div class="extras">
    <div v-if="welcomeOn" class="welcome">
      <p>你好，我是超级名片的在线接待。不必加好友，直接留言即可。</p>
      <button type="button" @click="openChat">去留言</button>
      <button type="button" class="quiet" @click="welcomeOn = false">稍后</button>
    </div>
    <div class="chips">
      <button type="button" @click="$router.push({ path: '/site', query: { card: card.id } })">微官网</button>
      <button type="button" @click="wechatOpen = true">加我微信</button>
      <button type="button" @click="openChat">在线咨询</button>
      <button type="button" @click="$router.push({ path: '/poster', query: { card: card.id } })">海报</button>
      <button v-if="campaign?.enabled" type="button" @click="claim">领红包</button>
    </div>

    <section v-if="moduleOn('groupBuy') && groups.length" class="strip">
      <b>拼团（演示）</b>
      <p v-for="item in groups" :key="item.id">{{ item.title }} · {{ item.joined }}/{{ item.need }} · {{ item.priceText }}</p>
      <button type="button" @click="joinGroup(groups[0].id)">我要参团</button>
    </section>
    <section v-if="moduleOn('live') && lives.length" class="strip">
      <b>直播入口</b>
      <a v-for="item in lives" :key="item.id" :href="item.url || '#'" target="_blank" rel="noreferrer">{{ item.title }}</a>
    </section>
    <section v-if="moduleOn('stores') && shops.length" class="strip">
      <b>门店</b>
      <p v-for="item in shops" :key="item.id">{{ item.name }} · {{ item.address }}</p>
    </section>

    <div v-if="wechatOpen" class="sheet-mask" @click.self="wechatOpen = false">
      <div class="sheet">
        <div class="sheet-top"><strong>加我微信</strong><button type="button" @click="wechatOpen = false">关闭</button></div>
        <p class="note">还不是好友时展示活码。演示环境不会真的加好友。</p>
        <img v-if="card.wechatQr" :src="card.wechatQr" class="qr" alt="微信二维码" />
        <div v-else class="qr ph">二维码待上传</div>
        <p class="wxid">微信号 {{ card.wechatId || '未设置' }}</p>
        <button class="btn-navy stack-btn" type="button" @click="copyWx">复制微信号</button>
      </div>
    </div>

    <div v-if="chatOpen" class="sheet-mask" @click.self="chatOpen = false">
      <div class="sheet">
        <div class="sheet-top"><strong>在线接待</strong><button type="button" @click="chatOpen = false">关闭</button></div>
        <div class="log">
          <p v-for="message in thread.messages" :key="message.id" :class="message.from">
            <b>{{ who(message.from) }}</b> {{ message.text }}
          </p>
        </div>
        <div class="composer">
          <input v-model="draft" class="input" maxlength="80" placeholder="留言，不必加好友" />
          <button class="btn-navy" type="button" @click="send">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  campaignOf,
  claimReward,
  dbState,
  joinGroup,
  listGroupBuys,
  listLive,
  listStores,
  moduleOn,
  sendChat,
  visitorThread,
} from '../services/api.js'

const props = defineProps({
  card: { type: Object, required: true },
})
const wechatOpen = ref(false)
const chatOpen = ref(false)
const welcomeOn = ref(true)
const draft = ref('')
const thread = ref({ messages: [] })

onMounted(() => {
  const key = `wx-pop-${props.card.id}`
  if (props.card.wechatId && !sessionStorage.getItem(key)) {
    sessionStorage.setItem(key, '1')
    wechatOpen.value = true
  }
})

const campaign = computed(() => {
  dbState.campaigns?.length
  return campaignOf(props.card.id)
})
const groups = computed(() => {
  dbState.groupBuys?.length
  return listGroupBuys().filter((item) => item.enabled !== false)
})
const lives = computed(() => listLive().filter((item) => item.enabled !== false))
const shops = computed(() => listStores())

function openChat() {
  welcomeOn.value = false
  thread.value = visitorThread(props.card.id)
  chatOpen.value = true
}

function send() {
  sendChat(props.card.id, draft.value, 'visitor')
  draft.value = ''
  thread.value = visitorThread(props.card.id)
}

async function copyWx() {
  const text = props.card.wechatId || ''
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    /* 演示环境可能禁止剪贴板 */
  }
  wechatOpen.value = false
}

async function claim() {
  const result = claimReward(props.card.id)
  window.alert(result?.already ? '你已经领过这次演示红包' : `已记下：${result?.campaign?.reward || '演示红包'}`)
}

function who(from) {
  if (from === 'visitor') return '我'
  if (from === 'bot') return '自动回复'
  return '接待'
}
</script>

<style scoped>
.welcome {
  margin: 12px 12px 0;
  background: #142d54;
  color: #fff;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.welcome p { flex: 1 1 180px; font-size: 13px; line-height: 1.45; }
.welcome button { background: #fff; color: var(--navy); border-radius: 14px; padding: 4px 10px; font-size: 12px; }
.welcome .quiet { background: transparent; color: #fff; }
.chips { display: flex; gap: 8px; overflow-x: auto; padding: 12px 12px 0; }
.chips button {
  flex-shrink: 0;
  background: #fff;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  color: var(--navy);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}
.strip { margin: 10px 12px 0; background: #fff; border-radius: 12px; padding: 12px; }
.strip b { display: block; font-size: 14px; margin-bottom: 4px; }
.strip p, .strip a { display: block; font-size: 12px; color: #555; line-height: 1.6; }
.strip button { margin-top: 6px; color: var(--navy); font-size: 13px; }
.sheet-top { display: flex; justify-content: space-between; margin-bottom: 8px; }
.sheet-top button { color: var(--navy); }
.qr { width: 160px; height: 160px; object-fit: cover; margin: 8px auto; display: block; background: #f4f4f4; }
.qr.ph { display: flex; align-items: center; justify-content: center; color: #999; font-size: 13px; }
.wxid { text-align: center; font-size: 14px; margin-bottom: 8px; }
.log { max-height: 240px; overflow: auto; }
.log p { font-size: 13px; line-height: 1.45; margin: 8px 0; }
.log .visitor { text-align: right; }
.log b { display: block; font-size: 11px; color: #999; }
.composer { display: flex; gap: 8px; margin-top: 8px; }
.composer .input { flex: 1; }
.composer .btn-navy { padding: 0 12px; }
</style>
