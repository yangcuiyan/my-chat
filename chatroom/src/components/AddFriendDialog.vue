<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="300px"
    class="add-friend-dialog">
    <div class="c-item-msg">
      <img :src="info.avatar" alt="">
      <span class="name">{{ info.username || info.name }}</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        v-if="!info.membersNum"
        type="primary"
        @click="addFriend"
        class="add-friend"
      >加为好友</el-button>
      <template v-else>
        <span class="member">成员：{{ info.membersNum }}人</span>
        <el-button
          type="primary"
          @click="joinGroup"
          class="add-friend"
        >加入群组</el-button>
      </template>
    </span>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import getFriendId from '@/util/getFriendId'
import { Message } from 'element-ui'
export default {
  name: 'addFriend',
  props: ['value', 'info'],
  data () {
    return {
      dialogVisible: false
    }
  },
  watch: {
    value (newVal) {
      this.dialogVisible = newVal
    },
    dialogVisible (newVal) {
      this.$emit('input', newVal)
    }
  },
  computed: {
    ...mapState(['userInfo']),
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    addFriend () {
      const obj = {
        id: getFriendId(this.info._id, this.userInfo._id),
        from: {
          _id: this.userInfo._id,
          username: this.userInfo.username,
          avatar: this.userInfo.avatar
        },
        to: {
          _id: this.info._id,
          username: this.info.username,
          avatar: this.info.avatar
        }
      }
      this.$socket.emit('addFriend', obj)
      this.dialogVisible = false
    },
    joinGroup () {
      this.$socket.emit('joinGroup', {
        userId: this.userInfo._id,
        groupId: this.info._id
      })
      this.dialogVisible = false
    }
  },
  sockets: {
    addFriendAfter (data) {
      if (data.status === 400) {
        Message({
          message: data.msg,
          type: 'error',
          duration: 3 * 1000
        })
      } else {
        Message({
          message: '请求发送成功，等待回复',
          type: 'success',
          duration: 3 * 1000
        })
      }
    },
    a () {

    }
  }
}
</script>
<style lang="less" scoped>
  .add-friend {
    width: 100%;
  }
  .c-item-msg {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-bottom: 5px;
    }

  }
  .member {
    color: #333;
    font-size: 14px;
    line-height: 30px;
    float: left;
  }
</style>
