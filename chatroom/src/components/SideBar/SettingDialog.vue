<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="450px"
    class="setting-info-dialog">
    <el-tabs v-model="activeName" @tab-click="handleClick" stretch>
      <el-tab-pane label="功能" name="function">开发中......</el-tab-pane>
      <el-tab-pane label="主题" name="theme">
        <div class="theme-select">
          <el-radio-group v-model="radio" @change="selectTheme">
            <el-radio label="default" border>默认</el-radio>
            <el-radio label="cool" border>唯美</el-radio>
            <el-radio label="define" border>自定义</el-radio>
          </el-radio-group>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import config from '@/util/config'
import setCssVariable from '@/util/setCssVariable'
import { mapMutations } from 'vuex'
export default {
  name: 'settingDialog',
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'theme',
      radio: 'default'
    }
  },
  computed: {
    ...mapMutations(['setPrimaryColor', 'setPrimaryTextColor', 'setBackgroundImage'])
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
    handleClick () {

    },
    selectTheme () {
      const themeConfig = config.theme[this.radio]
      this.$store.commit('theme/setPrimaryColor', themeConfig.primaryColor)
      this.$store.commit('theme/setPrimaryTextColor', themeConfig.primaryTextColor)
      this.$store.commit('theme/setBackgroundImage', themeConfig.backgroundImage)
      setCssVariable(themeConfig.primaryColor, themeConfig.primaryTextColor)
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.setting-info-dialog {
  .theme-select {
    display: flex;
    justify-content: center;
    .el-radio {
      width: 130px;
      margin-left: 0;
      &:not(:last-child) {
        margin-right: 6px;
      }
    }
  }
}
</style>
