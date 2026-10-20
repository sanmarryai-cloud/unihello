<template>
  <section class="pad">
    <p class="note">这里编辑微官网。访客从名片上的「微官网」进入。</p>
    <label class="field"><span>语音标题</span><input v-model="voiceTitle" class="input" /></label>
    <label class="check"><input v-model="autoplay" type="checkbox" /> 进入页面时尝试自动播放</label>
    <button class="btn-navy stack-btn" type="button" @click="saveVoice(cardId, { title: voiceTitle, autoplay })">保存语音设置</button>

    <h3>动态</h3>
    <div class="composer"><input v-model="postText" class="input" placeholder="写一条动态" /><button type="button" @click="publish">发布</button></div>
    <h3>产品</h3>
    <div class="composer"><input v-model="productTitle" class="input" placeholder="产品名" /><button type="button" @click="addProd">添加</button></div>
    <h3>案例</h3>
    <div class="composer"><input v-model="caseTitle" class="input" placeholder="案例标题" /><button type="button" @click="addOneCase">添加</button></div>
    <h3>公众号 / 视频号</h3>
    <label class="field"><span>类型</span>
      <select v-model="embedKind" class="select"><option>公众号</option><option>视频号</option></select>
    </label>
    <div class="composer"><input v-model="embedTitle" class="input" placeholder="名称" /><button type="button" @click="addAccount">添加</button></div>
    <p class="note">链接只展示，不拉取对方账号里的内容。</p>
    <button class="btn-line" type="button" @click="$router.push({ path: '/site', query: { card: cardId } })">预览微官网</button>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { addCase, addEmbed, addPost, addProduct, adminCardId, saveVoice, siteBundle } from '../../services/api.js'

const cardId = adminCardId()
const bundle = siteBundle(cardId)
const voiceTitle = ref(bundle.voice.title || '')
const autoplay = ref(!!bundle.voice.autoplay)
const postText = ref('')
const productTitle = ref('')
const caseTitle = ref('')
const embedKind = ref('公众号')
const embedTitle = ref('')

function publish() {
  addPost(cardId, postText.value)
  postText.value = ''
}
function addProd() {
  addProduct(cardId, productTitle.value.trim())
  productTitle.value = ''
}
function addOneCase() {
  addCase(cardId, caseTitle.value.trim(), '演示案例')
  caseTitle.value = ''
}
function addAccount() {
  addEmbed(cardId, embedKind.value, embedTitle.value.trim(), '')
  embedTitle.value = ''
}
</script>

<style scoped>
h3 { margin: 14px 0 8px; font-size: 15px; }
.check { display: flex; gap: 8px; font-size: 14px; margin-bottom: 8px; }
.composer { display: flex; gap: 8px; }
.composer .input { flex: 1; }
button { color: var(--navy); }
.btn-line { width: 100%; margin-top: 12px; height: 40px; border-radius: 20px; border: 1px solid var(--navy); }
</style>
