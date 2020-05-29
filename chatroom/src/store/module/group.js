
const state = {
  groupInfo: {}
}

const getters = {
}

const mutations = {
  setGroup (state, group) {
    state.groupInfo = { ...state.groupInfo, ...group }
    console.log(state.groupInfo)
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
