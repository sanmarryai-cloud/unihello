<template>
  <section class="pad">
    <p class="note">套餐只改本地标记，不会跳转支付。</p>
    <article v-for="user in users" :key="user.id" class="row-card">
      <img :src="user.avatar" alt="" />
      <div>
        <b>{{ user.name }}</b>
        <p>{{ roleText(user.role) }} · {{ user.phone || '无手机号' }}</p>
      </div>
      <select class="select" :value="user.plan" @change="onPlan(user, $event)">
        <option v-for="plan in plans" :key="plan.id" :value="plan.id">{{ plan.name }}</option>
      </select>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { dbState, listUsers, PLANS as plans, setPlan } from '../../services/api.js'

const users = computed(() => {
  dbState.users.length
  return listUsers()
})

function roleText(role) {
  if (role === 'owner') return '名片主人'
  if (role === 'platform') return '平台'
  return '访客'
}

function onPlan(user, event) {
  setPlan(user.id, event.target.value)
}
</script>

<style scoped>
.row-card {
  display: flex;
  gap: 8px;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 8px;
}
img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #eee;
}
div {
  flex: 1;
  min-width: 0;
}
b {
  font-size: 14px;
}
p {
  font-size: 12px;
  color: #888;
}
.select {
  width: 92px;
  padding: 6px;
}
</style>
