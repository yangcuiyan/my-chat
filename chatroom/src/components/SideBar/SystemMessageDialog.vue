<template>
  <el-dialog
    title="好友通知"
    :visible.sync="dialogVisible"
    width="400px"
    class="system-message-dialog">
    <ul class="friend-message" v-if="friendList.size > 0">
      <li class="friend-message-item" v-for="(v, k) in friendList" :key="k">
        <img :src="v[1].avatar" alt="" v-if="!v[1].flag">
        <div class="info" v-if="!v[1].flag">
          <span class="name">{{ v[1].username }}</span>
          <span class="mes">请求加为好友</span>
        </div>
        <div v-if="!v[1].flag" class="other">
          <div class="button" v-if="v[1].status === 0">
            <el-tooltip class="item" effect="dark" content="同意" placement="top">
              <el-button type="success" icon="el-icon-check"  size="small" circle @click="agreeValidate(v)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="拒绝" placement="top">
              <el-button type="warning" icon="el-icon-close" circle size="small" @click="refuseValidate(v)"></el-button>
            </el-tooltip>
          </div>
          <div v-if="v[1].status === 1" class="agree">
            已同意
          </div>
          <div v-if="v[1].status === 2" class="agree">
            已拒绝
          </div>
        </div>
      </li>
    </ul>
    <span v-else>暂无消息</span>
  </el-dialog>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'systemMessageDialog',
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      tempList: new Map(),
      flag: null
    }
  },
  watch: {
    value (newVal) {
      this.dialogVisible = newVal
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  computed: {
    ...mapState(['friendSystemMessage', 'userInfo']),
    userInfo () {
      return this.$store.state.user.userInfo
    },
    friendSystemMessage () {
      const friendSystemMessage = this.$store.state.user.friendSystemMessage
      return friendSystemMessage
    },
    friendList () {
      for (const value of this.friendSystemMessage.values()) {
        const flag = this.userInfo._id === value.from._id
        const obj = {
          id: value.id,
          username: value.from.username,
          avatar: value.from.avatar,
          status: value.status,
          flag: flag
        }
        this.tempList.set(value.id.toString(), obj)
      }
      return this.tempList
    }
  },
  mounted () {
    this.tempList.clear()
    this.$store.commit('user/setFriendSystemMessage', new Map())
  },
  methods: {
    ...mapMutations(['setFriendSystemMessage']),
    agreeValidate (item) {
      const friend = this.friendSystemMessage.get(item[0])
      this.$socket.emit('agreeValidate', friend)
      this.dialogVisible = false
    },
    refuseValidate (item) {
      this.$socket.emit('refuseValidate', item[1])
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.system-message-dialog {
  .friend-message {
    .friend-message-item {
      display: flex;
      margin: 5px 0;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .del {
        margin-left: 10px;
      }
      .other {
        margin-left: 60px;
      }
      .info {
        margin-right: 60px;
        display: flex;
        flex-direction: column;
        width: 80px;
        .name {
          display: inline-block;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          max-width: 80px;
        }
        .mes {
          font-size: 12px;
        }
      }
      .mine {
        margin-left: 20px;
        width: 74px;
        span {
          margin-left: 30px;
        }
      }
      .button {
        line-height: 40px;
      }
      .agree {
        line-height: 40px;
        margin-left: 30px;
      }
    }
  }
}
</style>
