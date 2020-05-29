const Message = require('../model/message')
const { getAvatarData } = require('../util/getRandomAvatar')
const { getFileData } = require('../util/getBinFile')
const obj = {}

/**
 * 获取当前联系人的最新15条聊天信息
 * @param to 当前群组的id
 * @param limit
 * @returns {Promise<void>}
 */
async function getCurLastMessage(to, type, limit = 15) {
    obj[to] = 0
    let detailMes = await Message.find({to: to}).sort({createTime: -1}).limit(limit).populate('from', {
        _id: 1,
        username: 1,
        avatar: 1,
        tag: 1
    })
    detailMes = detailMes.map(ele => {
        return convertMessage(ele)
    })
    return detailMes.reverse();
}

/**
 * 保存信息
 * @param data
 * @returns {Promise<{createTime, style, from, _id, to, content}|{createTime, style, _id, to, content}>}
 */
async function saveMessages(data) {
    let message = await Message.create({
        ...data,
        from: data.from
    })
    let detailMes = await Message.findOne({_id: message._id}).populate('from', {
        _id: 1,
        username: 1,
        avatar: 1,
        tag: 1
    })
    return convertMessage(detailMes)
}

/**
 * 获取所有联系人最后的一条聊天信息
 * @param linkmanIds
 * @returns {Promise<{data: *, status: number}>}
 */
async function getLinkmansLastMessages(linkmanIds) {
    const promises = linkmanIds.map(linkmanId =>
        Message.find(
            {to: linkmanId},
            {
                style: 1,
                content: 1,
                createTime: 1,
                from: 1,
                to: 1,
                filename: 1
            },
            {
                sort: {createTime: -1},
                limit: 15
            }
        ).populate('from', {username: 1, avatar: 1, tag: 1})
    )
    const results = await Promise.all(promises)
    const messages = linkmanIds.reduce((result, linkmanId, index) => {
        const mes = results[index]
        const lastMsg = mes[0];
        result[linkmanId] = convertMessage(lastMsg)
        return result
    }, {})
    return {status: 200, data: messages};
}

async function getHistoryMessage(id) {
    let messages = await Message.find({to: id}).sort({createTime: -1}).skip((obj[id] + 1) * 15).limit(15).populate('from', {
        _id: 1,
        username: 1,
        avatar: 1,
        tag: 1
    })
    obj[id] === 0 ? obj[id] ++ : ''
    messages = messages.map(ele => {
        return convertMessage(ele)
    })
    return messages.reverse();
}

function convertMessage(message) {
    if (!message) return ''
    const reg = /base64/g;
    const reg2 = /file/
    const reg3 = /image/
    let temp = ''
    if (message.from) {
        !reg.test(message.from.avatar) && (message.from.avatar = getAvatarData(message.from.avatar))
        reg2.test(message.content) && (message.content = JSON.stringify(getFileData(message.content)))
        reg3.test(message.content) && (message.content = getAvatarData(message.content))
        return {
            _id: message._id,
            style: message.style,
            content: message.content,
            createTime: message.createTime,
            to: message.to,
            filename: message.filename,
            fileWidth: message.fileWidth,
            fileHeight: message.fileHeight,
            from: {
                avatar: message.from.avatar,
                tag: message.from.tag,
                username: message.from.username,
                _id: message.from._id
            }
        };
    } else {
        return {
            _id: message._id,
            style: message.style,
            content: message.content,
            createTime: message.createTime,
            to: message.to,
        }
    }
}

module.exports = {
    getCurLastMessage,
    getLinkmansLastMessages,
    saveMessages,
    getHistoryMessage
}