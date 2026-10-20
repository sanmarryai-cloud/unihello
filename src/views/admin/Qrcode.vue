<template>
  <section class="pad">
    <p class="note">访客还不是好友时，名片上会弹出「加我微信」。这里的二维码和微信号只存在这台手机。</p>
    <label class="field"><span>微信号</span><input v-model="wechatId" class="input" maxlength="40" placeholder="supercard-demo" /></label>
    <label class="field">
      <span>微信或企微二维码</span>
      <input class="input" type="file" accept="image/*" @change="onFile" />
    </label>
    <img v-if="wechatQr" :src="wechatQr" class="preview" alt="" />
    <button class="btn-navy stack-btn" type="button" @click="save">保存活码</button>
    <p v-if="tip" class="note">{{ tip }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { adminCardId, getCard, saveGate } from '../../services/api.js'

const card = getCard(adminCardId())
const wechatId = ref(card?.wechatId || '')
const wechatQr = ref(card?.wechatQr || '')
const tip = ref('')

function onFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (file.size > 500000) {
    tip.value = '图片请小于 500KB'
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    wechatQr.value = String(reader.result || '')
  }
  reader.readAsDataURL(file)
}

function save() {
  saveGate(adminCardId(), { wechatId: wechatId.value, wechatQr: wechatQr.value })
  tip.value = '已保存。回到名片点「加我微信」即可看到。'
}
</script>

<style scoped>
.preview { width: 140px; height: 140px; object-fit: cover; border-radius: 8px; margin-bottom: 10px; }
</style>
