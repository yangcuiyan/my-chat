import getData from '@/util/localStorage'
const { primaryColor, primaryTextColor, backgroundImage } = getData()
const state = {
  primaryColor: primaryColor, // 主题背景颜色
  primaryTextColor: primaryTextColor, // 主题文字颜色
  backgroundImage: backgroundImage
}

const mutations = {
  setPrimaryColor (state, bgcolor) {
    state.primaryColor = bgcolor
  },
  setPrimaryTextColor (state, color) {
    state.primaryTextColor = color
  },
  setBackgroundImage (state, img) {
    state.backgroundImage = img
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
