module.exports = {
    port: 3000,//端口
    baseUrl: 'http://localhost:3000',
    saltLength: 10, //加密盐长度
    jwtSecret: 'jstSecret',//用于生成token
    tokenExpiresTime: 1000 * 60 * 60 * 24 * 7,//token过期时间
    defaultGroupName: 'free',//默认群组名
    administrator: '',//管理员
    captcha: '',
    token: ''
}
