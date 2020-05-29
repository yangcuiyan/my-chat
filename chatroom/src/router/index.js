import Vue from 'vue'
import Router from 'vue-router'
import Blank from '../layout/blank'
import Login from '../views/login'
import Register from '../views/register'
import Chat from '../views/chat'
// import Cookies from 'js-cookie'

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'blank',
      component: Blank,
      redirect: '/login',
      children: [{
        path: '/login',
        name: 'login',
        component: Login
      }, {
        path: '/register',
        name: 'register',
        component: Register
      }]
    }, {
      path: '/chat',
      name: 'chat',
      component: Chat,
      meta: { requireAuth: true }
    }
  ]
})
