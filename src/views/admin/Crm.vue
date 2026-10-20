<template>
  <section class="pad">
    <p class="note">上传名片照片后请自己填字段。OCR 两个字只表示这是演示，不会把图片送去识别。</p>
    <label class="field"><span>名片照片</span><input class="input" type="file" accept="image/*" @change="onFile" /></label>
    <img v-if="preview" :src="preview" class="shot" alt="" />
    <p v-if="preview" class="note">识别结果（演示）：没有自动填入，请手工填写。</p>
    <label class="field"><span>姓名</span><input v-model="form.name" class="input" /></label>
    <label class="field"><span>手机</span><input v-model="form.phone" class="input" /></label>
    <label class="field">
      <span>分组</span>
      <select v-model="form.group" class="select">
        <option>意向</option>
        <option>已联系</option>
        <option>已成交</option>
      </select>
    </label>
    <label class="field"><span>备注</span><input v-model="form.note" class="input" /></label>
    <button class="btn-navy stack-btn" type="button" @click="create">存入客户</button>

    <article v-for="item in people" :key="item.id" class="row">
      <b>{{ item.name }} · {{ item.group }}</b>
      <p>{{ item.phone }}</p>
      <p v-for="note in item.notes" :key="note.id">备注：{{ note.text }}</p>
      <p v-for="follow in item.follows" :key="follow.id">
        跟进：{{ follow.text }}
        <em v-if="follow.remindAt">提醒 {{ when(follow.remindAt) }}</em>
      </p>
      <div class="composer">
        <input v-model="followText[item.id]" class="input" placeholder="写一条跟进" />
        <button type="button" @click="follow(item.id)">记下</button>
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { addFollow, dbState, listContacts, saveContact } from '../../services/api.js'

const preview = ref('')
const form = reactive({ name: '', phone: '', group: '意向', note: '' })
const followText = reactive({})
const people = computed(() => {
  dbState.contacts?.length
  return listContacts()
})

function onFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    preview.value = String(reader.result || '')
  }
  reader.readAsDataURL(file)
}

function create() {
  if (!form.name.trim()) return
  saveContact({ ...form, ocrNote: preview.value ? '已上传图片，字段手工填写' : '' })
  form.name = ''
  form.phone = ''
  form.note = ''
}

function follow(id) {
  const text = (followText[id] || '').trim()
  if (!text) return
  addFollow(id, text, Date.now() + 24 * 60 * 60 * 1000)
  followText[id] = ''
}

function when(stamp) {
  const date = new Date(stamp)
  return `${date.getMonth() + 1}/${date.getDate()}`
}
</script>

<style scoped>
.shot { width: 100%; max-height: 160px; object-fit: cover; border-radius: 10px; margin-bottom: 8px; }
.row { background: #fff; border-radius: 12px; padding: 12px; margin-top: 10px; }
p { font-size: 12px; color: #555; margin-top: 4px; }
em { color: #1a3a6b; font-style: normal; }
.composer { display: flex; gap: 8px; margin-top: 8px; }
.composer .input { flex: 1; }
button { color: var(--navy); }
</style>
