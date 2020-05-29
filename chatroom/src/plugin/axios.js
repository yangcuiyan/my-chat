import axios from 'axios'
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
import router from '@/router'

const instance = axios.create({
  baseURL: '/api',
  timeout: 20000 // 请求超时时间
})

// 请求拦截器
instance.interceptors.request.use(function (config) {
  // console.log(config)
  const token = Cookies.get('token')
  if (token && token !== 'undefined' && token !== '') {
    config.headers.Authorization = token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(function (response) {
  const res = response.data
  if (res.status !== 200) {
    Message({
      message: res.msg,
      type: 'error',
      duration: 3 * 1000
    })
    if (res.status === 401) {
      Cookies.remove('token')
      router.push({ name: 'login' })
    }
    return Promise.reject(res)
  } else {
    if (response.config.success && response.config.success.type === 'message') {
      Message(response.config.success.options)
    }
    return response.data
  }
}, function (error) {
  if (error.response && error.response.status === 400) {
    Message({
      message: error.response.data.msg,
      type: 'error',
      duration: 3 * 1000
    })
    Cookies.remove('token')
    router.push({ name: 'login' })
  }
  return Promise.reject(error)
})

export default instance
