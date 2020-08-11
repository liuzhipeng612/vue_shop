import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入需要使用路由展示的组件
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users'

Vue.use(VueRouter)

// 设置一个常量，路由数组[]为数组,{}为对象
// path为浏览器访问的接口路径
// component为vue内部访问地址，即导入的组件名
const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: Login
}, {
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  }, {
    path: '/users',
    component: Users
  }]
}]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，标识放行
  // next() 代表放行, next('/login') 代表强制跳转
  // 如果用户访问登录页，直接放行
  if (to.path === '/login') return next()
  // 从sessionStorage中获取并保存token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有token，强制跳转登录页
  if (!tokenStr) return next('/login')
  // 否则放行
  next()
})

export default router
