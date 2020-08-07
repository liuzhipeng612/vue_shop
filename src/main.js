import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
// 导入axios发起api请求
import axios from 'axios'
// 设置api请求基本域名
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置Vue原属性prototype的$http采用axios插件
// 将axios关联到Vue的原型对象$http上
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
