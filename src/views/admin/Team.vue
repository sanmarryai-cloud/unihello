<template>
  <section class="pad">
    <p class="note">老板定模板和资料，成员生成同款名片。统计的是这些名片上的访问和回递。</p>
    <label class="field"><span>团队名</span><input v-model="form.name" class="input" /></label>
    <label class="field"><span>一句话</span><input v-model="form.slogan" class="input" /></label>
    <button class="btn-navy stack-btn" type="button" @click="saveTeam({ ...form })">保存团队</button>
    <div class="stat-grid">
      <div><b>{{ stats.members }}</b><span>成员名片</span></div>
      <div><b>{{ stats.visits }}</b><span>访问</span></div>
      <div><b>{{ stats.returns }}</b><span>回递</span></div>
    </div>
    <article v-for="item in roster" :key="item.id" class="row">
      <b>{{ item.name }}</b>
      <p>{{ item.card?.company || '超级名片科技' }}</p>
    </article>
    <h3>给成员生成同款</h3>
    <label class="field"><span>姓名</span><input v-model="memberName" class="input" /></label>
    <label class="field"><span>手机</span><input v-model="memberPhone" class="input" /></label>
    <button class="btn-line" type="button" @click="mint">生成名片</button>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { dbState, mintMemberCard, saveTeam, teamDashboard, teamOfOwner, teamRoster } from '../../services/api.js'

const team = teamOfOwner()
const form = reactive({ name: team?.name || '', slogan: team?.slogan || '' })
const memberName = ref('')
const memberPhone = ref('')
const roster = computed(() => {
  dbState.teamMembers?.length
  return teamRoster()
})
const stats = computed(() => {
  dbState.visits.length
  dbState.referral_edges.length
  return teamDashboard()
})

function mint() {
  if (!memberName.value.trim()) return
  mintMemberCard(memberName.value.trim(), memberPhone.value.trim())
  memberName.value = ''
  memberPhone.value = ''
}
</script>

<style scoped>
.row { background: #fff; border-radius: 12px; padding: 10px 12px; margin-bottom: 8px; }
p { font-size: 12px; color: #888; }
h3 { margin: 12px 0 8px; font-size: 15px; }
.btn-line { width: 100%; height: 40px; border-radius: 20px; border: 1px solid var(--navy); color: var(--navy); }
</style>
