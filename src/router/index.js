import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import Fill from '../views/Fill.vue'
import Success from '../views/Success.vue'
import MyCard from '../views/MyCard.vue'
import Share from '../views/Share.vue'
import Poster from '../views/Poster.vue'
import Site from '../views/Site.vue'
import AdminShell from '../views/admin/AdminShell.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import ProfileEdit from '../views/admin/ProfileEdit.vue'
import Library from '../views/admin/Library.vue'
import Radar from '../views/admin/Radar.vue'
import CommentsMod from '../views/admin/CommentsMod.vue'
import Notices from '../views/admin/Notices.vue'
import Qrcode from '../views/admin/Qrcode.vue'
import Inbox from '../views/admin/Inbox.vue'
import Rewards from '../views/admin/Rewards.vue'
import Team from '../views/admin/Team.vue'
import Crm from '../views/admin/Crm.vue'
import Company from '../views/admin/Company.vue'
import Reports from '../views/admin/Reports.vue'
import SiteEditor from '../views/admin/SiteEditor.vue'
import Identities from '../views/admin/Identities.vue'
import Imports from '../views/admin/Imports.vue'
import PlatformShell from '../views/platform/PlatformShell.vue'
import Overview from '../views/platform/Overview.vue'
import Users from '../views/platform/Users.vue'
import Templates from '../views/platform/Templates.vue'
import Audit from '../views/platform/Audit.vue'
import Referrals from '../views/platform/Referrals.vue'
import Modules from '../views/platform/Modules.vue'
import Points from '../views/platform/Points.vue'
import Commission from '../views/platform/Commission.vue'
import GroupBuy from '../views/platform/GroupBuy.vue'
import Live from '../views/platform/Live.vue'
import Stores from '../views/platform/Stores.vue'

const routes = [
  { path: '/', name: 'home', component: Home, meta: { title: '超级名片' } },
  { path: '/auth', name: 'auth', component: Auth, meta: { title: '微信授权' } },
  { path: '/fill', name: 'fill', component: Fill, meta: { title: '完善名片' } },
  { path: '/success', name: 'success', component: Success, meta: { title: '回递成功' } },
  { path: '/my', name: 'my', component: MyCard, meta: { title: '我的名片' } },
  { path: '/share', name: 'share', component: Share, meta: { title: '分享名片' } },
  { path: '/poster', name: 'poster', component: Poster, meta: { title: '名片海报' } },
  { path: '/site', name: 'site', component: Site, meta: { title: '微官网' } },
  {
    path: '/admin',
    component: AdminShell,
    children: [
      { path: '', name: 'admin', component: Dashboard, meta: { title: '名片管理' } },
      { path: 'profile', name: 'admin-profile', component: ProfileEdit, meta: { title: '编辑资料' } },
      { path: 'library', name: 'admin-library', component: Library, meta: { title: '视频库' } },
      { path: 'radar', name: 'admin-radar', component: Radar, meta: { title: '访客雷达' } },
      { path: 'notices', name: 'admin-notices', component: Notices, meta: { title: '通知中心' } },
      { path: 'comments', name: 'admin-comments', component: CommentsMod, meta: { title: '评论审核' } },
      { path: 'qrcode', name: 'admin-qrcode', component: Qrcode, meta: { title: '获客活码' } },
      { path: 'inbox', name: 'admin-inbox', component: Inbox, meta: { title: '在线接待' } },
      { path: 'rewards', name: 'admin-rewards', component: Rewards, meta: { title: '扫码领红包' } },
      { path: 'team', name: 'admin-team', component: Team, meta: { title: '团队名片' } },
      { path: 'crm', name: 'admin-crm', component: Crm, meta: { title: '客户' } },
      { path: 'company', name: 'admin-company', component: Company, meta: { title: '公司资料' } },
      { path: 'reports', name: 'admin-reports', component: Reports, meta: { title: '访客日报' } },
      { path: 'site', name: 'admin-site', component: SiteEditor, meta: { title: '微官网编辑' } },
      { path: 'identities', name: 'admin-identities', component: Identities, meta: { title: '多名片' } },
      { path: 'imports', name: 'admin-imports', component: Imports, meta: { title: '外链素材' } },
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
      { path: 'modules', name: 'platform-modules', component: Modules, meta: { title: '可选模块' } },
      { path: 'points', name: 'platform-points', component: Points, meta: { title: '积分' } },
      { path: 'commission', name: 'platform-commission', component: Commission, meta: { title: '分佣' } },
      { path: 'group-buy', name: 'platform-group', component: GroupBuy, meta: { title: '拼团' } },
      { path: 'live', name: 'platform-live', component: Live, meta: { title: '直播入口' } },
      { path: 'stores', name: 'platform-stores', component: Stores, meta: { title: '门店' } },
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
