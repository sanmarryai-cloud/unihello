<template>
  <section class="pad">
    <p v-if="!moduleOn('stores')" class="note">门店模块已关闭。</p>
    <article v-for="item in rows" :key="item.id" class="row">
      <b>{{ item.name }}</b>
      <p>{{ item.address }}</p>
      <p>{{ item.phone }}</p>
    </article>
    <label class="field"><span>店名</span><input v-model="name" class="input" /></label>
    <label class="field"><span>地址</span><input v-model="address" class="input" /></label>
    <label class="field"><span>电话</span><input v-model="phone" class="input" /></label>
    <button class="btn-navy stack-btn" type="button" @click="add">添加门店</button>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { dbState, listStores, moduleOn, saveStore } from '../../services/api.js'

const name = ref('')
const address = ref('')
const phone = ref('')
const rows = computed(() => {
  dbState.stores?.length
  return listStores()
})

function add() {
  if (!name.value.trim()) return
  saveStore(name.value.trim(), address.value.trim(), phone.value.trim())
  name.value = ''
  address.value = ''
  phone.value = ''
}
</script>

<style scoped>
.row { background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 8px; }
p { font-size: 12px; color: #666; margin-top: 4px; }
</style>
