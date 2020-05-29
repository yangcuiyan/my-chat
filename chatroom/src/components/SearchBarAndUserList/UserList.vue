<template>
  <div class="user-list">
    <ul class="c-user" v-if="userList.length > 0">
      <li
        v-for="(item, i) in userList"
        :key="item._id"
        :class="['c-user-item', {focus: item._id === userInfo.focus._id}]"
        @click="lookChattingInfo(i, item)"
      >
        <img :src="item.avatar" alt="头像">
        <div class="c-content">
          <p class="title">{{ item.name }}</p>
          <p class="content">
            <span class="sender" v-if="item.lastMsg && item.lastMsg.name">{{ item.lastMsg.name }}:</span>
            <span class="msg" v-if="item.lastMsg">{{ item.lastMsg.filename || item.lastMsg.content }}</span>
            <span v-else class="no-msg">暂无消息</span>
            <span class="time">{{ (item.lastMsg && item.lastMsg.time) || item.time }}</span>
            <span class="read" v-if="item.unReadNum">{{ item.unReadNum }}</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import utilTime from '@/util/time'
export default {
  name: 'userList',
  data () {
    return {
      index: null
      // userList: [{
      //   id: 1,
      //   title: 'title1', // 好友或群组的名称
      //   sender: 'sender', // 群组中的发送者
      //   msg: 'msgfdajkahgkjahjgklfdajghkljd', // 发送或接收消息的最后一次聊天内容
      //   time: '23:59', // 发送或接收消息的最后一次时间
      //   unReadNum: 1, // 未读信息数量
      //   avatar: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3162816245,4100265419&fm=111&gp=0.jpg',
      //   type: 1, // 0表示好友，1表示群组
      //   manager: 1 // 0表示普通成员，1表示群组
      // }, {
      //   id: 2,
      //   title: 'title2', // 好友或群组的名称
      //   sender: 'sender', // 群组中的发送者
      //   msg: 'msgfdajkahgkjahjgklfdajghkljd', // 发送或接收消息的最后一次聊天内容
      //   time: '23:59', // 发送或接收消息的最后一次时间
      //   unReadNum: 1, // 未读信息数量
      //   avatar: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3162816245,4100265419&fm=111&gp=0.jpg',
      //   type: 0
      // }]
    }
  },
  computed: {
    ...mapState(['userInfo']),
    userInfo () {
      return this.$store.state.user.userInfo
    },
    userList () {
      let linkmans = this.userInfo.linkmans
      if (!linkmans) return []
      linkmans = linkmans.map(linkman => {
        return {
          ...linkman,
          time: utilTime.getExactTime(new Date(linkman.createTime), new Date())
        }
      })
      linkmans.sort((a, b) => {
        if (a.lastMsg && b.lastMsg) {
          return new Date(b.lastMsg.createTime).getTime() - new Date(a.lastMsg.createTime).getTime()
        } else {
          return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
        }
      })
      return linkmans
    }
  },
  methods: {
    ...mapMutations(['setFocus']),
    lookChattingInfo (index, listItem) {
      console.log(index, this.index)
      if (this.index === index) return false
      this.index = index
      this.$store.commit('user/setFocus', listItem)
      this.$socket.emit('setFocus', { focus: listItem })
    }
  }
}
</script>
<style lang="less" scoped>
  .user-list {
    .c-user {
      max-height: 477.19px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 0px;
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

      .c-user-item {
        display: flex;
        height: 90px;
        padding: 10px 16px;
        box-sizing: border-box;
        align-items: center;
        cursor: pointer;

        &.focus {
          background-color: var(--primary-color-7);
        }

        img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          margin-right: 16px;
        }

        .c-content {
          position: relative;
          flex: 1;

          .title {
            font-size: 16px;
            margin-bottom: 6px;
            color: var(--primary-text-color-10);
            font-size: 14px;
          }

          .content {
            font-size: 14px;
            font-weight: lighter;
            width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--primary-text-color-7);

            .no-msg {
              font-size: 12px;
              color: var(--primary-text-color-7);
            }
          }

          .time {
            position: absolute;
            right: 0;
            top: 0;
            font-size: 12px;
            color: var(--primary-text-color-7);
          }

          .read {
            position: absolute;
            right: 0;
            width: 18px;
            height: 18px;
            background-color: var(--primary-color-10);
            text-align: center;
            line-height: 18px;
            border-radius: 50%;
            font-size: 12px;
            color: #e9e9e9;
          }
        }
      }
    }
  }
</style>
