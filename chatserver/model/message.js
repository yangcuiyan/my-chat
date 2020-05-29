const {Schema, model} = require('mongoose');
const messageSchema = new Schema({
    from: {//消息发送者
        type: Schema.ObjectId,
        ref: "User"
    },
    to: {//消息接收者，发送给群时为群_id, 发送给个人时为_id
        type: String,
        index: true,
        required: true
    },
    style: {//消息类型，默认是文本
        type: String,
        enum: ['text', 'image', 'code', 'system', 'invite', 'file', 'emoji'],
        default: "text"
    },
    content: {//消息内容
        type: String,
        default: ''
    },
    createTime: {//消息发送时间
        type: Date,
        default: Date.now()
    },
    filename: String,
    fileWidth: Number,
    fileHeight: Number
})

module.exports = model('Message', messageSchema);
