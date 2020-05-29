<template>
  <div class="header-bar">
    <span class="header-bar-name">{{ name }}</span>
    <el-tooltip class="item" effect="dark" content="群组信息" placement="top" v-if="type !== 0">
      <span class="list iconfont icon-list" @click="showGroupInfo"></span>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="分享" placement="top"  v-if="type !== 0">
      <span class="share iconfont icon-share" v-clipboard:copy="'invite::' + name" v-clipboard:success="onCopy" v-clipboard:error="onError"></span>
    </el-tooltip>
    <group-info :class="{hide: isHide}" @hide="hideGroupInfo"/>
  </div>
</template>
<script>
import GroupInfo from './GroupInfo'
import { mapState } from 'vuex'
export default {
  name: 'headerBar',
  components: {
    GroupInfo
  },
  data () {
    return {
      isHide: true
    }
  },
  computed: {
    ...mapState(['userInfo']),
    name () {
      const focus = this.$store.state.user.userInfo.focus
      return focus && focus.name
    },
    type () {
      const focus = this.$store.state.user.userInfo.focus
      return focus && focus.type
    }
  },
  mounted () {
    document.body.addEventListener('click', this.handleBodyClick, false)
  },
  methods: {
    /**
     * 显示修改群组信息
     **/
    showGroupInfo () {
      this.isHide = false
      this.$socket.emit('getGroupMembers', this.name)
    },
    /**
     * 为body绑定事件
     * @param e
     * @returns {boolean}
     */
    handleBodyClick (e) {
      let { target, currentTarget } = e
      if (target.className.indexOf('icon-list') > -1) return false
      do {
        if (target.className.indexOf('group-info') > -1) return false
        target = target.parentElement
      } while (target && target !== currentTarget)
      this.isHide = true
    },
    /**
     * 邀请好友，复制成功
     */
    onCopy () {
      this.$message({
        message: '已复制邀请信息到粘贴板，去邀请其他人入群吧',
        type: 'success'
      })
    },
    /**
     * 复制失败
     */
    onError () {
      this.$message.error('复制失败')
    },
    hideGroupInfo () {
      this.isHide = true
    }
  }
}
</script>
<style lang="less" scoped>
  .header-bar {
    height: 70px;
    border-bottom: 1px solid rgba(208, 208, 208, 0.6);
    line-height: 70px;
    padding: 0px 30px 0 20px;
    .header-bar-name {
      color: #000;
      font-weight: 600;
    }
    .iconfont {
      color: lightpink;
      float: right;
      font-size: 30px;
      cursor: pointer;
      color: var(--primary-color-10);

      &.share {
        margin-right: 10px;
      }
    }
  }
</style>
