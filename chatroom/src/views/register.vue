<template>
  <el-form :model="registerForm" ref="registerForm" :rules="rules">
    <el-form-item prop="username">
      <el-input v-model="registerForm.username" placeholder="用户名" >
        <i slot="prepend" class="iconfont icon-ico_username"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="registerForm.password" placeholder="密码" type="password">
        <i slot="prepend" class="iconfont icon-mima54"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="ackPass">
      <el-input v-model="registerForm.ackPass" placeholder="确认密码" type="password">
        <i slot="prepend" class="iconfont icon-mima54"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="vertifycode">
      <el-input v-model="registerForm.vertifycode" placeholder="验证码" class="vertifycode" @keyup.enter.native="registerSubmit">
        <i slot="prepend" class="iconfont icon-yanzhengma"></i>
      </el-input>
      <img :src="imageCodeUrl" @click="getImageCode" class="vertifycode">
    </el-form-item>
    <el-form-item>
      <el-button round type="primary" @click="registerSubmit">注册</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { register } from '@/api/user'
export default {
  name: 'login',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('验证码为4位'))
      } else {
        callback()
      }
    }
    return {
      imageCodeUrl: '',
      registerForm: {
        username: '',
        password: '',
        ackPass: '', // 确认密码
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
        ackPass: [
          { validator: validatePass, trigger: 'blur' }
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
    /**
     * 获取验证码
     */
    getImageCode () {
      this.imageCodeUrl = '/api/getImageCode/captcha?' + Math.random()
    },
    // 注册
    registerSubmit () {
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          try {
            const result = await register(this.registerForm)
            result.status === 200 && this.$router.push({ name: 'login' })
            this.$refs.registerForm.resetFields()
          } catch (err) {
            this.imageCodeUrl = '/api/getImageCode/captcha?' + Math.random()
          }
        } else {
          return false
        }
      })
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
