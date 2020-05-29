import Vue from 'vue'
import Vuex from 'vuex'
import theme from './module/theme'
import group from './module/group'
import user from './module/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    theme,
    group,
    user
  }
})
