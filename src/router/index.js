import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import Success from '../views/Success.vue'
import MyCard from '../views/MyCard.vue'

const routes = [
  { path: '/', name: 'home', component: Home, meta: { title: '超级名片' } },
  { path: '/auth', name: 'auth', component: Auth, meta: { title: '微信授权' } },
  { path: '/success', name: 'success', component: Success, meta: { title: '创建成功' } },
  { path: '/my', name: 'my', component: MyCard, meta: { title: '我的名片' } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.afterEach((to) => {
  document.title = to.meta.title || '超级名片'
})

export default router
