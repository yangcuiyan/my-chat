<template>
  <div class="c-chat"
       v-loading="loading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
       :style="{backgroundImage: `url(${backgroundImage})`}">
    <div class="c-chat-blur" :style="{backgroundImage: `url(${backgroundImage})`}"></div>
    <div class="c-chat-wrapper">
      <side-bar/>
      <search-bar-and-user-list/>
      <chat-area/>
    </div>
  </div>
</template>
<script>
import SideBar from '@/components/SideBar'
import SearchBarAndUserList from '@/components/SearchBarAndUserList'
import ChatArea from '@/components/ChatArea'
import { login } from '@/api/user'
import { getLinkmansLastMessages } from '@/api/message'
import Cookies from 'js-cookie'
import { mapMutations, mapState } from 'vuex'
import getFriendId from '@/util/getFriendId'
import convertMessage from '@/util/convertMessage'
export default {
  name: 'chat',
  components: {
    SideBar,
    SearchBarAndUserList,
    ChatArea
  },
  data () {
    return {
      loading: false,
      title: 'title', // 好友或群组的名称
      sender: 'sender', // 群组中的发送者
      msg: 'msgfdajkahgkjahjgklfdajghkljd', // 发送或接收消息的最后一次聊天内容
      time: '23:59', // 发送或接收消息的最后一次时间
      unReadNum: 1, // 未读信息数量
      search: '', // 搜做关键字
      sendMsg: 'sendMsg' // 发送的消息
    }
  },
  mounted () {
    this.$socket.emit('connect')
  },
  computed: {
    ...mapState(['userInfo']),
    userInfo () {
      return this.$store.state.user.userInfo
    },
    backgroundImage () {
      return this.$store.state.theme.backgroundImage
    }
  },
  methods: {
    ...mapMutations(['setUserInfo', 'setLinkmans', 'setMessages'])
  },
  sockets: {
    async connect () {
      const token = Cookies.get('token')
      try {
        this.loading = true
        const user = await login(token)
        if (user.status === 200) {
          this.$store.commit('user/setUserInfo', user.data)
          this.$socket.emit('init', { socketId: this.$socket.id, userId: this.userInfo._id })
          const linkmanIds = [
            ...user.data.groups.map(group => group._id),
            ...user.data.friends.map(friend => getFriendId(friend.from, friend.to._id))
          ]
          const result = await getLinkmansLastMessages(linkmanIds)
          const linkmansMessages = result.data
          const messages = Object.keys(linkmansMessages).map(id => {
            let message = linkmansMessages[id]
            message = message && convertMessage(message, this.userInfo.username)
            return { [id]: message }
          })
          this.$store.commit('user/setLinkmans', { groups: user.data.groups, friends: user.data.friends, messages: messages })
          this.loading = false
          const joinUser = {
            focus: this.userInfo.focus,
            linkmans: this.userInfo.linkmans
          }
          this.$socket.emit('join', joinUser)
          this.$socket.emit('checkAddFriend', { userId: this.userInfo._id, socketId: this.$socket.id })
        } else {
          this.$router.push({ name: 'login' })
        }
      } catch (err) {
        console.log(err)
        this.$router.push({ name: 'login' })
      }
    },
    leaved (data) {
      console.log(data)
    }
  }
}
</script>
<style  scoped lang="less">
  .c-chat {
    height: 100vh;
    background-size: 100% 100%;
    background-position: 0 0;
    background-image: url("../assets/img/1.jpg");
    .c-chat-blur {
      background-image: url("../assets/img/1.jpg");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 70%;
      min-width: 850px;
      height: 90%;
      left: 15%;
      top: 5%;
      position: absolute;
      -webkit-filter: blur(10px); /* Chrome, Opera */
      -moz-filter: blur(10px);
      -ms-filter: blur(10px);
      filter: blur(10px);
    }
    .c-chat-wrapper {
      width: 70%;
      min-width: 850px;
      height: 90%;
      left: 15%;
      top: 5%;
      position: absolute;
      border-radius: 10px;
      color: var(--primary-text-color-7);
      display: flex;
      box-shadow: 0px 0px 60px rgba(0, 0, 0, 0.5);
    }
  }
</style>
