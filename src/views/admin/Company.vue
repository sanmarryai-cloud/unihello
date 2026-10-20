<template>
  <section class="pad" v-if="form">
    <p class="note">工商简介由你自己填写。实名和企业认证是展示用的标记，没有接认证机构。</p>
    <label class="field"><span>企业名称</span><input v-model="form.legalName" class="input" /></label>
    <label class="field"><span>统一社会信用代码</span><input v-model="form.creditCode" class="input" /></label>
    <label class="field"><span>成立</span><input v-model="form.founded" class="input" /></label>
    <label class="field"><span>地址</span><input v-model="form.address" class="input" /></label>
    <label class="field"><span>经营范围</span><textarea v-model="form.scope" class="textarea" /></label>
    <label class="check"><input v-model="form.verifiedPerson" type="checkbox" /> 显示实名标记</label>
    <label class="check"><input v-model="form.verifiedCompany" type="checkbox" /> 显示企业认证标记</label>
    <button class="btn-navy stack-btn" type="button" @click="save">保存</button>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { adminCardId, getCard, saveCompany } from '../../services/api.js'

const card = getCard(adminCardId())
const form = reactive({
  legalName: card?.legalName || '',
  creditCode: card?.creditCode || '',
  founded: card?.founded || '',
  address: card?.address || '',
  scope: card?.scope || '',
  verifiedPerson: !!card?.verifiedPerson,
  verifiedCompany: !!card?.verifiedCompany,
})

function save() {
  saveCompany(adminCardId(), { ...form })
}
</script>

<style scoped>
.check { display: flex; gap: 8px; align-items: center; font-size: 14px; margin-bottom: 8px; }
</style>
