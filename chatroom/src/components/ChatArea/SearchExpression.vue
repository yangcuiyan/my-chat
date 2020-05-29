<template>
  <div class="search-expression">
    <div class="search">
      <el-input
        v-model="keyword"
        class="search-input"
        clearable
        @keyup.enter.native="searchExpression"></el-input>
      <el-button type="primary" size="small" class="search-btn" @click="searchExpression">搜索</el-button>
    </div>
    <ul class="search-result">
      <li v-for="(item, i) in expressions" :key="i" @click="selectExpression(item)">
        <img :src="item.image" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
// import { getExpression } from '@/api/message'
// import axios from '@/plugin/axios'
export default {
  name: 'searchExpression',
  data () {
    return {
      keyword: '',
      expressions: []
    }
  },
  methods: {
    async searchExpression () {
      // const res = await getExpression(this.keyword)
      // console.log(res)
      this.$socket.emit('searchExpression', this.keyword)
    },
    selectExpression (expression) {
      this.$emit('selectExpression', expression)
    }
  },
  sockets: {
    getExpression (result) {
      this.expressions = result
    }
  }
}
</script>
<style scoped lang="less">
.search-expression {
  height: 200px;
  overflow-y: auto;
  .search {
    display: flex;

    .search-input {
      margin-right: 10px;
    }
  }

  .search-result {
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;
    height: 156px;
    margin-top: 4px;
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
    li {
      margin: 0 4px;
      img {
        width: 90px;
        height: 90px;
        cursor: pointer;
      }
    }
  }
}
</style>
