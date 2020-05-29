const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    username: {//账号
        type: String,
        unique: true,
        required: true,
        match: /^([0-9a-zA-Z]|[\u4e00-\u9eff]){3,8}$/
    },
    password: {//密码
        type: String,
        require: true
    },
    avatar: String,//用户头像
    sex: {//性别 0男，1女
        type: Number,
        default: 0
    },
    age: Number,//年龄
    signature: {//个性签名
        type: String,
        default: '这个人很懒，暂时没有签名哦！',
        match: /^(.*){1,30}$/
    },
    email: {//邮箱
        type: String,
        default: '',
        match: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    },
    phone: {//手机号码
        type: String,
        default: '',
        match: /^1[3456789]\d{9}$/
    },
    createTime: {//用户注册时间
        type: Date,
        default: Date.now()
    },
    lastLoginTime: {//最后一次登录时间
        type: Date,
        default: Date.now()
    },
    tag: {//用户标签
        type: String,
        trim: true,
        default: '',
        match: /^([0-9a-zA-Z]{1,2}|[\u4e00-\u9eff]){1,5}$/
    },
    salt: {//加密盐
        type: String
    }
})

module.exports = model('User', userSchema);
