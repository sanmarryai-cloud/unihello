<template>
  <div class="page fill">
    <header class="subhead">
      <button type="button" class="back" @click="$router.back()">‹</button>
      <span>完善名片</span>
      <span class="spacer" />
    </header>
    <section class="pad">
      <p class="note">回递前请留下姓名和手机。这会生成你自己的名片，并记下是从哪张名片、哪个 scene 来的。</p>
      <label class="field"><span>姓名</span><input v-model="name" class="input" maxlength="20" placeholder="怎么称呼你" /></label>
      <label class="field"><span>手机</span><input v-model="phone" class="input" maxlength="20" inputmode="tel" placeholder="11 位手机号" /></label>
      <button class="btn-navy stack-btn" type="button" :disabled="!valid" @click="submit">创建并继续</button>
      <p class="parent">将回递给：{{ parent?.name || '超级名片演示' }}</p>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createReturnCard, getCard } from '../services/api.js'

const route = useRoute()
const router = useRouter()
const name = ref('')
const phone = ref('')
const avatar = ref('')

const parentId = computed(() => String(route.query.card || 'card_main'))
const parent = computed(() => getCard(parentId.value) || getCard('card_main'))
const valid = computed(() => name.value.trim().length >= 1 && /^1\d{10}$/.test(phone.value.trim()))

onMounted(() => {
  try {
    const draft = JSON.parse(sessionStorage.getItem('super-card-draft') || '{}')
    name.value = draft.nickname || ''
    avatar.value = draft.avatar || ''
  } catch {
    name.value = ''
  }
})

function submit() {
  if (!valid.value) return
  const card = createReturnCard({
    parentCardId: parent.value?.id || 'card_main',
    scene: String(route.query.scene || 'return'),
    name: name.value.trim(),
    phone: phone.value.trim(),
    avatar: avatar.value,
  })
  sessionStorage.removeItem('super-card-draft')
  router.replace({
    path: '/success',
    query: {
      card: card.id,
      parent: parent.value?.id || 'card_main',
      scene: String(route.query.scene || 'return'),
    },
  })
}
</script>

<style scoped>
.back {
  font-size: 28px;
  width: 36px;
}
.spacer {
  width: 36px;
}
.parent {
  margin-top: 14px;
  font-size: 12px;
  color: #888;
  text-align: center;
}
.stack-btn:disabled {
  opacity: 0.45;
}
</style>
