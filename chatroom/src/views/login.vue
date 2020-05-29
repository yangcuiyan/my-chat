<template>
  <el-form :model="loginForm" ref="loginForm" :rules="rules">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="用户名" >
        <i slot="prepend" class="iconfont icon-ico_username"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" placeholder="密码" type="password">
        <i slot="prepend" class="iconfont icon-mima54"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="vertifycode">
      <el-input v-model="loginForm.vertifycode" placeholder="验证码" class="vertifycode" @keyup.enter.native="submitLogin">
        <i slot="prepend" class="iconfont icon-yanzhengma"></i>
      </el-input>
      <img :src="imageCodeUrl" @click="getImageCode" class="vertifycode" >
    </el-form-item>
    <el-form-item>
      <el-button round type="primary" @click="submitLogin">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { login } from '@/api/user'
import Cookies from 'js-cookie'
import { mapMutations } from 'vuex'
export default {
  name: 'login',
  data () {
    const validateCode = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('验证码为4位'))
      } else {
        callback()
      }
    }
    return {
      imageCodeUrl: '',
      loginForm: {
        username: '',
        password: '',
        vertifycode: ''// 验证码
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        vertifycode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.imageCodeUrl = '/api/getImageCode/captcha?' + Math.random()
  },
  methods: {
    ...mapMutations(['setUserInfo', 'setLinkmans']),
    /**
     * 获取验证码
     * @param e
     */
    getImageCode () {
      this.imageCodeUrl = '/api/getImageCode/captcha?' + Math.random()
    },
    /**
     * 登录
     */
    submitLogin () {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            const result = await login(this.loginForm)
            Cookies.set('token', result.token, { expires: 7 })
            this.$router.push({ name: 'chat' })
            this.$refs.loginForm.resetFields()
          } catch (err) {
            this.loginForm.vertifycode = ''
            this.imageCodeUrl = '/api/getImageCode/captcha?' + Math.random()
          }
        } else {
          return false
        }
      })
    }
  },
  sockets: {
    connect () {
      console.log('新用户连接')
    }
  }
}
</script>
<style scoped lang="less">
  .el-button {
    width: 100%;
  }

  .other {
    color: #666;
    span {
      color: #409eff;
      cursor: pointer;
    }
  }
  .vertifycode {
    width: 220px;
  }
  img.vertifycode {
    width: 100px;
    height: 100%;
  }
</style>
