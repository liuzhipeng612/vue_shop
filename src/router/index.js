import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入需要使用路由展示的组件
import Login from '@/components/Login'

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
}]

const router = new VueRouter({
  routes
})

export default router
