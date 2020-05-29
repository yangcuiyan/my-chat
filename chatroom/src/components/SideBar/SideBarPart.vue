<template>
  <div class="c-side-bar">
    <div class="c-avatar">
      <el-tooltip class="item" effect="dark" content="个人信息" placement="right-start">
        <img :src="avatar" alt="头像" @click="openPersonalInfo">
      </el-tooltip>
    </div>
    <div class="c-setting">
      <div class="c-voice">
        <el-tooltip class="item" effect="dark" content="系统消息" placement="right-start">
          <i class="iconfont icon-voice" @click="openSystemMessage"></i>
        </el-tooltip>
      </div><div class="c-set">
        <el-tooltip class="item" effect="dark" content="设置" placement="right-start">
          <i class="iconfont icon-shezhi" @click="openSettingInfo"></i>
        </el-tooltip>
      </div>
      <div class="c-logout">
        <el-tooltip class="item" effect="dark" content="退出" placement="right-start">
          <i class="iconfont icon-tuichu" @click="logout"></i>
        </el-tooltip>
      </div>
    </div>
    <personal-info-dialog v-model="personalDialogVisible"/>
    <setting-dialog v-model="settingDialogVisible"/>
    <system-message-dialog v-model="systemMessageDialog"/>
  </div>
</template>
<script>
import PersonalInfoDialog from './PersonalInfoDialog'
import SettingDialog from './SettingDialog'
import SystemMessageDialog from './SystemMessageDialog'
import Cookies from 'js-cookie'
import { mapState } from 'vuex'
export default {
  name: 'sideBarPart',
  components: {
    PersonalInfoDialog,
    SettingDialog,
    SystemMessageDialog
  },
  data () {
    return {
      personalDialogVisible: false,
      settingDialogVisible: false,
      systemMessageDialog: false
    }
  },
  computed: {
    ...mapState(['userInfo']),
    avatar () {
      return this.$store.state.user.userInfo.avatar
    }
  },
  methods: {
    /**
     * 打开个人设置
     */
    openPersonalInfo () {
      this.personalDialogVisible = true
    },
    /**
     * 打开设置信息
     */
    openSettingInfo () {
      this.settingDialogVisible = true
    },
    /**
     * 退出登录
     */
    logout () {
      this.$confirm('此操作将退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Cookies.remove('token')
        this.$router.push({ name: 'login' })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {

      })
    },
    /**
     * 打开好友通知窗口
     */
    openSystemMessage () {
      this.systemMessageDialog = true
    }
  }
}
</script>
<style lang="less" scoped>
  .c-side-bar {
    width: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: var(--primary-color-8);
    padding: 40px 10px;
    box-sizing: border-box;
    .c-avatar {
      img{
        width: 60px;
        height: 60px;
        border-radius: 50%;
        cursor: pointer;
      }
    }
    .c-setting {
      text-align: center;
      div {
        margin-top: 10px;
        cursor: pointer;
      }
      i {
        font-size: 26px;
        line-height: 40px;
      }
      .c-set i {
        font-size: 30px;
      }
      .c-voice i {
        font-size: 33px;
        margin-left: 3px;
      }
    }
  }
</style>
