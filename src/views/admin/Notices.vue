<template>
  <section class="pad">
    <p class="note">打开、点联系、回递会立刻出现在这里。人在管理页时也会弹出一条提示。</p>
    <button class="btn-line" type="button" @click="markAllRead(cardId)">全部标为已读</button>
    <button class="btn-line" type="button" @click="subscribe">{{ subscribed ? '已记录订阅意向' : '开启微信订阅消息（演示）' }}</button>
    <p class="note">订阅消息只做开关，不会真的发到微信。</p>
    <article v-for="item in items" :key="item.id" class="row" :class="{ unread: !item.read }" @click="markNoticeRead(item.id)">
      <b>{{ item.title }}</b>
      <p>{{ item.body }}</p>
    </article>
    <p v-if="!items.length" class="note">还没有通知。</p>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { adminCardId, dbState, listNotices, markAllRead, markNoticeRead, setSubscribe, subscribeOn } from '../../services/api.js'

const cardId = computed(() => {
  dbState.meta && dbState.meta.adminCardId
  return adminCardId()
})
const items = computed(() => {
  dbState.notices?.length
  return listNotices(cardId.value)
})
const subscribed = ref(subscribeOn())

function subscribe() {
  subscribed.value = setSubscribe(true)
}
</script>

<style scoped>
.row { background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 8px; }
.unread { box-shadow: inset 3px 0 0 var(--navy); }
b { font-size: 14px; }
p { font-size: 12px; color: #666; margin-top: 4px; }
.btn-line {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  border: 1px solid var(--navy);
  color: var(--navy);
  margin-bottom: 8px;
}
</style>
