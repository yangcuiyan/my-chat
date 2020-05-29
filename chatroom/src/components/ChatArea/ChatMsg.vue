<template>
  <ul class="msg-list" ref="msgList" @scroll="scroll"
      >
    <li
      class="msg-list-item"
      v-for="item in msgList"
      :key="item._id">
      <message-item :type="item.type" :info="item"/>
    </li>
  </ul>
</template>
<script>
import MessageItem from './MessageItem'
import { mapState } from 'vuex'
export default {
  name: 'chatMsg',
  components: {
    MessageItem
  },
  data () {
    return {
      height: null
    }
  },
  computed: {
    ...mapState(['userInfo']),
    userInfo () {
      return this.$store.state.user.userInfo
    },
    msgList () {
      const focus = this.userInfo.focus
      if (focus && focus.messages) {
        console.log(focus.isBottom)
        this.scrollToBottom(focus.isBottom)
        return focus.messages
      }
      return []
    }
  },
  methods: {
    scrollToBottom (flag) {
      this.$nextTick(() => {
        const ul = this.$refs.msgList
        // const liArr = ul ? ul.children : []
        // console.log(liArr)
        // liArr.length > 0 && liArr[liArr.length - 1].scrollIntoView(false)
        if (flag) {
          ul.scrollTop = ul.scrollHeight
          this.height = ul.scrollHeight
        } else {
          ul.scrollTop = ul.scrollHeight - this.height
          this.height = ul.scrollHeight
        }
      })
    },
    scroll (e) {
      if (e.target.clientHeight === e.target.scrollHeight) return false
      if (e.target.scrollTop === 0 && e.target.children.length > 0) {
        this.$socket.emit('getHistoryMessages', this.userInfo.focus)
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .msg-list {
    flex: 1;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 20px;
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: rgba(0,0,0,0.2);
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 20px;
      background: rgba(0,0,0,0.1);
    }
  }
</style>
