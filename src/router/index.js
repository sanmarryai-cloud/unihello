import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import Fill from '../views/Fill.vue'
import Success from '../views/Success.vue'
import MyCard from '../views/MyCard.vue'
import Share from '../views/Share.vue'
import AdminShell from '../views/admin/AdminShell.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import ProfileEdit from '../views/admin/ProfileEdit.vue'
import Library from '../views/admin/Library.vue'
import Radar from '../views/admin/Radar.vue'
import CommentsMod from '../views/admin/CommentsMod.vue'
import PlatformShell from '../views/platform/PlatformShell.vue'
import Overview from '../views/platform/Overview.vue'
import Users from '../views/platform/Users.vue'
import Templates from '../views/platform/Templates.vue'
import Audit from '../views/platform/Audit.vue'
import Referrals from '../views/platform/Referrals.vue'

const routes = [
  { path: '/', name: 'home', component: Home, meta: { title: '超级名片' } },
  { path: '/auth', name: 'auth', component: Auth, meta: { title: '微信授权' } },
  { path: '/fill', name: 'fill', component: Fill, meta: { title: '完善名片' } },
  { path: '/success', name: 'success', component: Success, meta: { title: '回递成功' } },
  { path: '/my', name: 'my', component: MyCard, meta: { title: '我的名片' } },
  { path: '/share', name: 'share', component: Share, meta: { title: '分享名片' } },
  {
    path: '/admin',
    component: AdminShell,
    children: [
      { path: '', name: 'admin', component: Dashboard, meta: { title: '名片管理' } },
      { path: 'profile', name: 'admin-profile', component: ProfileEdit, meta: { title: '编辑资料' } },
      { path: 'library', name: 'admin-library', component: Library, meta: { title: '视频库' } },
      { path: 'radar', name: 'admin-radar', component: Radar, meta: { title: '访客雷达' } },
      { path: 'comments', name: 'admin-comments', component: CommentsMod, meta: { title: '评论审核' } },
    ],
  },
  {
    path: '/platform',
    component: PlatformShell,
    children: [
      { path: '', name: 'platform', component: Overview, meta: { title: '平台总览' } },
      { path: 'users', name: 'platform-users', component: Users, meta: { title: '用户与套餐' } },
      { path: 'templates', name: 'platform-templates', component: Templates, meta: { title: '名片模板' } },
      { path: 'audit', name: 'platform-audit', component: Audit, meta: { title: '内容审核' } },
      { path: 'referrals', name: 'platform-referrals', component: Referrals, meta: { title: '推荐关系' } },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.afterEach((to) => {
  document.title = to.meta.title || '超级名片'
})

export default router
