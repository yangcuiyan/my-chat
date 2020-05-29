<template>
  <div class="c-list">
    <search/>
    <user-list/>
  </div>
</template>
<script>
import Search from './Search'
import UserList from './UserList'
export default {
  name: 'searchBarAndUserList',
  components: {
    Search,
    UserList
  },
  data () {
    return {

    }
  }
}
</script>
<style lang="less" scoped>
  .c-list {
    width: 300px;
    background-color: var(--primary-color-5);
    height: 100%;
  }
</style>
