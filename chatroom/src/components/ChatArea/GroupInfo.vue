<template>
  <div class="group-info">
    <h6>群组信息</h6>
    <div class="alter-avatar" v-if="isManager">
      <span>修改群头像</span>
      <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <div class="alter-group-name"  v-if="isManager">
      <span>修改群名称</span>
      <el-input v-model="groupName" class="group-name"></el-input>
      <el-button type="primary">确认修改</el-button>
    </div>
    <div class="function">
      <span>功能</span>
      <el-button type="danger"  v-if="isManager" @click="delGroup">解散群组</el-button>
      <el-button type="danger"  v-else>退出群组</el-button>
    </div>
    <ul class="online-user">
      <span>在线成员</span>
      <li v-for="item in members" :key="item._id">
        <img :src="item.avatar" alt="">
        <span>{{ item.username }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'groupInfo',
  data () {
    return {
      dialogVisible: false
    }
  },
  mounted () {
  },
  computed: {
    ...mapState(['userInfo']),
    userInfo () {
      return this.$store.state.user.userInfo
    },
    groupName () {
      const focus = this.$store.state.user.userInfo.focus
      return focus && focus.name
    },
    imageUrl () {
      const focus = this.$store.state.user.userInfo.focus
      return focus && focus.avatar
    },
    members () {
      const focus = this.$store.state.user.userInfo.focus
      return focus && focus.members
    },
    isManager () {
      const focus = this.$store.state.user.userInfo.focus
      if (focus && focus.creator && focus.creator === this.userInfo._id) return true
      else return false
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
  methods: {
    beforeAvatarUpload () {

    },
    /**
     * 解散群组
     */
    delGroup () {
      this.$emit('hide')
      this.$socket.emit('delGroup', this.userInfo.focus._id)
    }
  }
}
</script>
<style lang="less" scoped>
  .group-info {
    overflow-y: auto;
    width: 300px;
    height: 100%;
    position: absolute;
    background-color: rgba(250, 250, 250, 0.95);
    right: 0;
    top: 0;
    z-index: 2;
    color: #333;
    padding: 0 12px;
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

    h6 {
      font-size: 14px;
      color: #666;
      text-align: center;
      border-bottom: 1px solid #e8e8e8;
    }
    .alter-avatar {
      display: flex;
      flex-direction: column;
      height: 150px;
      .avatar-uploader {
        .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          &:hover {
            border-color: #409EFF;
          }
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 100px;
          height: 100px;
          line-height: 100px;
          text-align: center;
          border: 2px solid #eee;
          box-sizing: border-box;
        }
        .avatar {
          width: 100px;
          height: 100px;
          display: block;
        }
      }
    }
    .alter-group-name {
      display: flex;
      flex-direction: column;
      .group-name {
        line-height: 36px;
        margin: 0px 0px 10px;
      }
    }
    span {
      line-height: 33px;
      font-size: 14px;
      font-weight: bold;
      padding: 12px 0 0 0;
      margin-bottom: 5px;
    }
    .function {
      display: flex;
      flex-direction: column;
    }
    .online-user {
      line-height: 1.2em;
      margin-top: 10px;
      li {
        display: flex;
        height: 24px;
        line-height: 24px;
        align-items: center;
        margin-bottom: 10px;
        img {
          width: 24px;
          height: 24px;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          border-radius: 50%;
          margin-right: 10px;
        }
        span {
          margin: 0;
          padding: 0;
          color: #333;
          font-size: 14px;
          font-weight: 400;
          max-width: 120px;
          word-break: keep-all;
          max-width: 120px;
        }
      }
    }

  }
</style>
