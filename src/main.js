import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'

// 导入axios发起api请求
import axios from 'axios'
// 设置api请求基本域名
axios.defaults.baseURL = 'http://api.pysdev.com:8888/api/private/v1/'
// axios请求拦截器interceptors中的请求方法的use回调函数
axios.interceptors.request.use((config) => {
  // 给headers的Authorization赋值为登录时获取的token
  // 当headers中没有该字段的时候会自动创建字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 配置Vue原属性prototype的$http采用axios插件
// 将axios关联到Vue的原型对象$http上
Vue.prototype.$http = axios
Vue.component(ZkTable.name, ZkTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
