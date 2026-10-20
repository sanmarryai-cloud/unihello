<template>
  <section class="pad" v-if="form">
    <label class="field"><span>名称</span><input v-model="form.name" class="input" maxlength="30" /></label>
    <label class="field"><span>手机</span><input v-model="form.phone" class="input" maxlength="20" /></label>
    <label class="field"><span>公司</span><input v-model="form.company" class="input" maxlength="40" /></label>
    <label class="field"><span>城市</span><input v-model="form.city" class="input" maxlength="20" /></label>
    <label class="field"><span>详情</span><textarea v-model="form.detail" class="textarea" maxlength="120" /></label>
    <button class="btn-navy stack-btn" type="button" @click="save">保存资料</button>
    <p v-if="saved" class="note">已保存，返回名片即可看到。</p>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { adminCardId, dbState, getCard, updateCard } from '../../services/api.js'

const form = ref(null)
const saved = ref(false)
const cardId = computed(() => {
  dbState.meta && dbState.meta.adminCardId
  return adminCardId()
})

watch(
  cardId,
  (id) => {
    const card = getCard(id)
    if (!card) return
    form.value = {
      name: card.name,
      phone: card.phone,
      company: card.company,
      city: card.city,
      detail: card.detail,
    }
    saved.value = false
  },
  { immediate: true },
)

function save() {
  updateCard(cardId.value, form.value)
  saved.value = true
}
</script>
