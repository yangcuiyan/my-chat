const {Schema, model} = require('mongoose');
const groupSchema = new Schema({
    name: {//账号
        type: String,
        unique: true,
        required: true,
        match: /^([0-9a-zA-Z]{1,2}|[\u4e00-\u9eff]){1,8}$/
    },
    avatar: {//群头像
        type: String
    },
    desc: {//群描述
        type: String,
        default: '',
        match: /^(.*){1,50}$/
    },
    creator: {//群组创建者
        type: Schema.ObjectId,
        ref: "User"
    },
    createTime: {//群组创建时间
        type: Date,
        default: Date.now()
    },
    members: [//群组成员
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    announcement: {//群公告
        type: String,
        default: ''
    },
    isDefault: {//是否为默认群组
        type: Boolean,
        default: false
    }

});
module.exports = model('Group', groupSchema);
