import axios from '@/plugin/axios'

export function login (params) {
  return axios({
    url: '/login',
    method: 'post',
    data: params
  })
}

export function register (params) {
  return axios({
    url: '/register',
    method: 'post',
    data: params,
    success: {
      type: 'message',
      options: {
        message: '注册成功',
        type: 'success'
      }
    }
  })
}
