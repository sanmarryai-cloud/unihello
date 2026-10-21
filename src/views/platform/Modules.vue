<template>
  <section class="pad">
    <p class="note">下面这些是可选模块。关掉后，访客名片上不再出现对应入口。没有真实支付。</p>
    <label v-for="item in items" :key="item.key" class="switch">
      <input type="checkbox" :checked="moduleOn(item.key)" @change="setModule(item.key, $event.target.checked)" />
      <span><b>{{ item.name }}</b><em>{{ item.desc }}</em></span>
    </label>

    <section class="addon">
      <b>{{ MEETING_PLAN.name }}</b>
      <em>{{ MEETING_PLAN.priceText }} · 按名片开通，不扣款</em>
      <label v-for="card in cards" :key="card.id" class="switch">
        <input type="checkbox" :checked="meetingsEnabled(card.id)" @change="setMeetingsAddon(card.id, $event.target.checked)" />
        <span><b>{{ card.name }}</b><em>{{ card.detail || card.company || '未填说明' }}</em></span>
      </label>
      <p class="note">关掉某张名片后，访客首页不再显示会议入口，主人端会看到开通页。已经发出的回放链接仍可打开。</p>
    </section>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { dbState, MEETING_PLAN, meetingsEnabled, moduleOn, setMeetingsAddon, setModule } from '../../services/api.js'

const cards = computed(() => {
  dbState.cards.length
  return dbState.cards
})

const items = [
  { key: 'points', name: '积分', desc: '领取红包和回递会记积分' },
  { key: 'commission', name: '分佣', desc: '在推荐关系上记一笔演示佣金' },
  { key: 'groupBuy', name: '拼团', desc: '名片上展示拼团，不收款' },
  { key: 'live', name: '直播', desc: '只放一个直播入口链接' },
  { key: 'stores', name: '门店', desc: '多门店列表' },
]
</script>

<style scoped>
.addon { margin-top: 16px; }
.addon > b { font-size: 16px; }
.addon > em { margin-bottom: 8px; }
.switch { display: flex; gap: 10px; align-items: flex-start; background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 8px; }
b { display: block; font-size: 14px; }
em { display: block; font-size: 12px; color: #888; font-style: normal; margin-top: 2px; }
</style>
