<template>
  <section class="pad">
    <p class="note">选中后写到当前正在管理的名片。访客页会换成对应样式，内容仍是这一张名片自己的。</p>
    <button
      v-for="item in templates"
      :key="item.id"
      type="button"
      class="tpl"
      :class="{ on: card?.templateId === item.id }"
      @click="pick(item.id)"
    >
      <b>{{ item.name }}</b>
      <span>{{ item.desc }}</span>
    </button>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { adminCardId, dbState, getCard, TEMPLATES as templates, updateCard } from '../../services/api.js'

const card = computed(() => {
  dbState.cards.length
  dbState.meta && dbState.meta.adminCardId
  return getCard(adminCardId())
})

function pick(id) {
  updateCard(adminCardId(), { templateId: id })
}
</script>

<style scoped>
.tpl {
  width: 100%;
  text-align: left;
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 8px;
  border: 1px solid transparent;
}
.tpl.on {
  border-color: var(--navy);
}
b {
  display: block;
  font-size: 15px;
  margin-bottom: 4px;
}
span {
  font-size: 12px;
  color: #888;
}
</style>
