<template>
  <section class="pad">
    <p v-if="!moduleOn('points')" class="note">积分模块已关闭。可在「模块」里重新打开。</p>
    <article v-for="item in rows" :key="item.id" class="row">
      <b>{{ item.name }} {{ item.delta > 0 ? '+' : '' }}{{ item.delta }}</b>
      <p>{{ item.reason }}</p>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { dbState, listPoints, moduleOn } from '../../services/api.js'

const rows = computed(() => {
  dbState.points?.length
  return listPoints()
})
</script>

<style scoped>
.row { background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 8px; }
p { font-size: 12px; color: #777; margin-top: 4px; }
</style>
