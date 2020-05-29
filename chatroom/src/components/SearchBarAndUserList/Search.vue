<template>
  <div class="c-search">
    <div class="c-search-wrapper">
      <el-input
        placeholder="搜索群组/用户"
        v-model="searchKey"
        :class="{focus: isFocus}"
        @focus="inputFocus"
        @blur="inputBlur"
        @keyup.enter.native="search"
      class="search-input">
        <i slot="prefix" class="el-input__icon el-icon-search" size="medium"></i>
        <i slot="suffix" class="iconfont icon-enter"></i>
      </el-input>
      <el-tabs v-model="activeName" @tab-click="handleClick" :class="[{hide: isHide}, 'c-search-tab']" stretch>
        <el-tab-pane label="全部" name="all">
          <search-result
            :name="activeName"
            :users="users"
            :groups="groups"
            @addFriend="addFriend"
            @joinGroup="joinGroup"
            @lookAllUserOrGroup="lookAllUserOrGroup"/>
        </el-tab-pane>
        <el-tab-pane label="用户" name="user">
          <search-result
            :name="activeName"
            :users="users"
            @addFriend="addFriend"/>
        </el-tab-pane>
        <el-tab-pane label="群组" name="group">
          <search-result
            :name="activeName"
            :groups="groups"
            @joinGroup="joinGroup"/>
        </el-tab-pane>
      </el-tabs>
    </div>
    <span class="iconfont icon-add" @click="createGroup"></span>
    <add-friend-dialog v-model="addFriendDialogVisible" :info="info"/>
    <create-group v-model="createGroupDialogVisible"/>
  </div>
</template>
<script>
import SearchResult from './SearchResult'
import AddFriendDialog from '@/components/AddFriendDialog'
import CreateGroup from './CreateGroup'
export default {
  name: 'Search',
  components: {
    SearchResult,
    AddFriendDialog,
    CreateGroup
  },
  data () {
    return {
      searchKey: '', // 搜索的关键词
      activeName: 'all', // 当前被选中的标签页
      isFocus: false, // 判断搜索框是否聚焦的变量
      isHide: true, // 存放搜索到的结果是否隐藏
      users: [], // 存放搜索到的用户
      groups: [], // 存放搜索到的群组
      addFriendDialogVisible: false, // 控制添加好友或加入组群对话框
      info: {}, // 表示添加的某个好友或组群
      createGroupDialogVisible: false // 控制创建群组对话框
    }
  },
  mounted () {
    document.body.addEventListener('click', this.handleBodyClick, false)
  },
  methods: {
    /**
     * 切换标签页
     * @param tab
     * @param event
     */
    handleClick (tab, event) {
    },
    /**
     * 搜索框获取焦点
     */
    inputFocus () {
      this.isFocus = true
      this.isHide = false
    },
    inputBlur (e) {
    },
    /**
     * 为body绑定事件
     * @param e
     * @returns {boolean}
     */
    handleBodyClick (e) {
      let { target, currentTarget } = e
      if (target.className === 'el-input__inner' || target.className === 'more') return false
      do {
        if (target.className.indexOf('c-search-tab') > -1) return false
        target = target.parentElement
      } while (target && target !== currentTarget)
      this.isFocus = false
      this.isHide = true
      this.searchKey = ''
      this.users = []
      this.groups = []
    },
    /**
     * 加为好友
     * @param user
     */
    addFriend (user) {
      this.isFocus = false
      this.isHide = true
      this.addFriendDialogVisible = true
      this.info = user
    },
    /**
     * 加入群组
     * @param group
     */
    joinGroup (group) {
      this.isFocus = false
      this.isHide = true
      this.addFriendDialogVisible = true
      this.info = group
    },
    lookAllUserOrGroup (activeName) {
      this.activeName = activeName
    },
    createGroup () {
      this.createGroupDialogVisible = true
    },
    search () {
      const searchObj = {
        keyword: this.searchKey
      }
      this.$socket.emit('searchLinkmans', searchObj)
    }
  },
  sockets: {
    searchResult (data) {
      this.users = data.users
      this.groups = data.groups
    }
  }
}
</script>
<style lang="less" scoped>
  .c-search {
    padding: 0px 12px;
    height: 70px;
    display: flex;
    align-items: center;
    .c-search-wrapper {
      position: relative;
      display: inline-block;
      .icon-enter {
        color: #666;
        font-size: 26px;
        line-height: 40px;
      }

      .focus {
        background-color: rgba(255, 255, 255, 0.9);
        -webkit-border-radius: 18px;
        -moz-border-radius: 18px;
        border-radius: 18px;
        width: 100%;
      }
      .c-search-tab {
        position: absolute;
        background-color: rgba(255, 255, 255, 0.9);
        z-index: 1;
        width: 100%;
        margin-top: 10px;
        -webkit-border-radius: 6px;
        -moz-border-radius: 6px;
        border-radius: 6px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        padding: 0 10px 10px 10px;
        box-sizing: border-box;
        color: #333;
      }

    }
    .icon-add {
      display: inline-block;
      width: 40px;
      height: 40px;
      font-size: 34px;
      line-height: 40px;
      text-align: center;
      margin-left: 5px;
      cursor: pointer;
      &:hover {
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
</style>
