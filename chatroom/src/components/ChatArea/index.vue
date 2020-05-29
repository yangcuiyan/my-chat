<template>
  <div class="c-chatting">
    <header-bar/>
    <chat-msg v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255,.4)"/>
    <send-msg-area/>
  </div>
</template>
<script>
import HeaderBar from './HeaderBar'
import ChatMsg from './ChatMsg'
import SendMsgArea from './SendMsgArea'
import { mapMutations } from 'vuex'
export default {
  name: 'charArea',
  components: {
    HeaderBar,
    ChatMsg,
    SendMsgArea
  },
  data () {
    return {
      loading: false
    }
  },
  mounted () {
    this.chattingMsgArea()
  },
  methods: {
    ...mapMutations(['setGroup']),
    /**
     * 当前一个用户或群组对应的聊天区域
     */
    chattingMsgArea () {
      this.bus.$on('lookChattingInfo', info => {
        // this.info.name = info.title
        // this.info.type = info.type
        // this.info.manager = info.manager
        // this.info.img = info.img
        this.$store.commit('group/setGroup', info)
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .c-chatting {
    -webkit-box-flex: 1;
    flex: 1;
    background-color: rgba(241, 241, 241, 0.6);
    display: flex;
    flex-direction: column;
    min-width: 470px;
  }
</style>
