import Vue from 'vue'
import App from './App.vue'
import VueSocketIo from 'vue-socket.io'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Cookies from 'js-cookie'
import router from './router'
import store from '@/store'
import getData from '@/util/localStorage'
import setCssVariable from '@/util/setCssVariable'
import VueClipboard from 'vue-clipboard2'

Vue.use(new VueSocketIo({
  debug: true,
  connection: process.env.VUE_APP_SOCKETIO,
  vuex: {
    store,
    mutationPrefix: 'socket_',
    actionPrefix: 'socket_'
  }
}))
Vue.use(ElementUI)
Vue.use(VueClipboard)

Vue.config.productionTip = false
Vue.prototype.bus = new Vue()

// 更新css variable
const { primaryColor, primaryTextColor } = getData()
console.log(primaryTextColor, primaryColor)
setCssVariable(primaryColor, primaryTextColor)
router.beforeEach((to, from, next) => {
  const token = Cookies.get('token')
  if (!token || token === 'undefined' || token === '') {
    if (to.name === 'login' || to.name === 'register') next()
    else next({ path: '/login' })
  } else {
    next()
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
