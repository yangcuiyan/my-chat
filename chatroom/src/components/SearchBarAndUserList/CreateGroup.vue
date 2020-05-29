<template>
  <el-dialog
    title="创建群组"
    :visible.sync="dialogVisible"
    width="450px"
    class="create-group-dialog">
    <div class="content">
      <span>请输入群组名</span>
      <el-input v-model="groupName" ref="createGroup" clearable @keyup.enter.native="createGroup"></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="createGroup"
      >创建</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'createGroup',
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      groupName: ''
    }
  },
  watch: {
    value (newVal) {
      this.$nextTick(() => { // 自动获取焦点
        this.$refs.createGroup.focus()
      })
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
    ...mapMutations(['setFocus']),
    /**
     * 创建组群
     */
    createGroup () {
      const group = {
        name: this.groupName,
        creator: this.userInfo._id,
        createTime: new Date()
      }
      this.$socket.emit('createGroup', group)
      this.groupName = ''
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
  .create-group-dialog {
    .content {
      span {
        margin-bottom: 5px;
        line-height: 31px;
      }
    }
  }
</style>
