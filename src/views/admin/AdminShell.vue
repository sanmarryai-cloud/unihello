<template>
  <div class="page admin-page">
    <header class="subhead">
      <button type="button" class="back" @click="$router.push('/')">‹</button>
      <span>名片管理</span>
      <span class="spacer" />
    </header>
    <nav class="subnav">
      <router-link to="/admin">概览</router-link>
      <router-link to="/admin/profile">资料</router-link>
      <router-link to="/admin/library">视频</router-link>
      <router-link to="/admin/radar">雷达</router-link>
      <router-link to="/admin/comments">评论</router-link>
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
