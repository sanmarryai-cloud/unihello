<template>
  <div class="page site">
    <header class="subhead">
      <button type="button" class="back" @click="$router.push({ path: '/', query: { card: card?.id } })">‹</button>
      <span>微官网</span>
      <span class="spacer" />
    </header>
    <section class="pad" v-if="card && bundle">
      <h2>{{ card.name }}</h2>
      <p class="note">{{ card.company }} · 产品、案例和动态都在这张名片上。</p>

      <h3>语音介绍</h3>
      <p class="note">{{ bundle.voice.title || '还没有语音' }}</p>
      <button class="btn-line" type="button" @click="playVoice">播放语音（演示蜂鸣）</button>
      <p v-if="bundle.voice.autoplay" class="note">已勾选自动播放。手机浏览器经常会拦住，所以这里仍需要点一下。</p>

      <h3>产品图集</h3>
      <article v-for="item in bundle.products" :key="item.id" class="tile">
        <div class="cover" :style="{ background: item.cover }" />
        <div><b>{{ item.title }}</b><p>{{ item.priceText }}</p></div>
      </article>

      <h3>案例墙</h3>
      <article v-for="item in bundle.cases" :key="item.id" class="tile">
        <div class="cover" :style="{ background: item.cover }" />
        <div><b>{{ item.title }}</b><p>{{ item.summary }}</p></div>
      </article>

      <h3>动态</h3>
      <article v-for="item in bundle.posts" :key="item.id" class="feed">
        <b>{{ card.name }}</b>
        <p>{{ item.text }}</p>
      </article>

      <h3>账号</h3>
      <a v-for="item in bundle.embeds" :key="item.id" class="link" :href="item.url || undefined">
        {{ item.kind }} · {{ item.title }}
        <em>{{ item.url ? '外链' : '未填链接' }}</em>
      </a>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getCard, siteBundle } from '../services/api.js'

const route = useRoute()
const card = computed(() => getCard(String(route.query.card || 'card_main')))
const bundle = computed(() => (card.value ? siteBundle(card.value.id) : null))

function playVoice() {
  const ctx = new AudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.frequency.value = 520
  gain.gain.value = 0.05
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.35)
}
</script>

<style scoped>
.back { font-size: 28px; width: 36px; }
.spacer { width: 36px; }
h2 { font-size: 20px; }
h3 { margin: 16px 0 8px; font-size: 15px; }
.tile, .feed, .link {
  display: flex;
  gap: 10px;
  background: #fff;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 8px;
  color: inherit;
}
.cover { width: 64px; height: 64px; border-radius: 8px; flex-shrink: 0; }
b { font-size: 14px; }
p, em { font-size: 12px; color: #777; font-style: normal; }
.btn-line { width: 100%; height: 40px; border-radius: 20px; border: 1px solid var(--navy); color: var(--navy); }
</style>
