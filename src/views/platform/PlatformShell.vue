<template>
  <div class="page admin-page">
    <header class="subhead">
      <button type="button" class="back" @click="$router.push('/')">‹</button>
      <span>平台后台</span>
      <span class="spacer" />
    </header>
    <nav class="subnav">
      <router-link to="/platform">总览</router-link>
      <router-link to="/platform/users">用户</router-link>
      <router-link to="/platform/templates">模板</router-link>
      <router-link to="/platform/audit">审核</router-link>
      <router-link to="/platform/referrals">关系</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
.back {
  font-size: 28px;
  width: 36px;
  color: #333;
}
.spacer {
  width: 36px;
}
</style>
