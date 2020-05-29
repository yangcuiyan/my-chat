<template>
  <div
    class="c-login"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="c-login-wrapper">
      <div class="title">
        <router-link :to="{name: 'login'}" :class="{active: this.$route.name === 'login'}">登录</router-link>
        |
        <router-link :to="{name: 'register'}" :class="{active: this.$route.name === 'register'}">注册</router-link>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
      loading: true
    }
  },
  mounted () {
    this.loading = false
  }
}
</script>
<style scoped lang="less">
  .c-login  {
    height: 100vh;
    background-size: 100% 100%;
    background-position: 0 0;
    background-image: url("../assets/img/bg.jpg");
    .c-login-wrapper {
      width: 400px;
      height: 400px;
      background-color: #fff;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      box-sizing: border-box;
      padding: 30px 40px;
      border-radius: 10px;

      .title {
        text-align: center;
        font-size: 18px;
        margin-bottom: 20px;
        color: #dcdfe6;
        line-height: 26px;
        a {
          font-size: 20px;
          color: #999;
          padding: 30px;
          font-weight: 500;
          &:hover {
            color: #409eff;
          }
          &.active {
            color: #409eff;
          }
        }
      }
    }
  }
</style>
