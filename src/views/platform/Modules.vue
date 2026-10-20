<template>
  <section class="pad">
    <p class="note">下面这些是可选模块。关掉后，访客名片上不再出现对应入口。没有真实支付。</p>
    <label v-for="item in items" :key="item.key" class="switch">
      <input type="checkbox" :checked="moduleOn(item.key)" @change="setModule(item.key, $event.target.checked)" />
      <span><b>{{ item.name }}</b><em>{{ item.desc }}</em></span>
    </label>
  </section>
</template>

<script setup>
import { moduleOn, setModule } from '../../services/api.js'

const items = [
  { key: 'points', name: '积分', desc: '领取红包和回递会记积分' },
  { key: 'commission', name: '分佣', desc: '在推荐关系上记一笔演示佣金' },
  { key: 'groupBuy', name: '拼团', desc: '名片上展示拼团，不收款' },
  { key: 'live', name: '直播', desc: '只放一个直播入口链接' },
  { key: 'stores', name: '门店', desc: '多门店列表' },
]
</script>

<style scoped>
.switch { display: flex; gap: 10px; align-items: flex-start; background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 8px; }
b { display: block; font-size: 14px; }
em { display: block; font-size: 12px; color: #888; font-style: normal; margin-top: 2px; }
</style>
