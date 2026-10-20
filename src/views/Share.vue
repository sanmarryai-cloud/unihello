<template>
  <div class="page share-page">
    <header class="subhead">
      <button type="button" class="back" @click="$router.back()">‹</button>
      <span>分享名片</span>
      <span class="spacer" />
    </header>
    <section class="pad" v-if="card">
      <h2>{{ card.name }}</h2>
      <SharePanel :card-id="card.id" :scene="scene" />
      <button class="btn-line" type="button" @click="$router.push({ path: '/', query: { card: card.id } })">预览这张名片</button>
    </section>
    <p v-else class="pad note">找不到要分享的名片。</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SharePanel from '../components/SharePanel.vue'
import { getCard, myCard } from '../services/api.js'

const route = useRoute()
const card = computed(() => getCard(String(route.query.card || '')) || myCard() || getCard('card_main'))
const scene = computed(() => String(route.query.scene || card.value?.scene || 'share'))
</script>

<style scoped>
.back {
  font-size: 28px;
  width: 36px;
}
.spacer {
  width: 36px;
}
h2 {
  font-size: 18px;
  margin-bottom: 8px;
}
.btn-line {
  width: 100%;
  margin-top: 16px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #ddd;
  color: #555;
}
</style>
