const Group = require('../model/group');
const User = require('../model/user');
const Message = require('../model/message');
const config = require('../config');
const util = require("../util/getRandomAvatar");

require("../util/database");

/**
 * 创建群组
 * @param name
 * @param desc
 * @param username
 * @returns {Promise<{msg: string, code: number, data: {creator: (*|creator|{ref, type}), name: *, avatar: (string|*|number|StringConstructor|String|avatar), desc: (*|desc|{default, match, type}|number|SVGDescElement)}}|{msg: string}|{msg: string}|{msg: string}>}
 */
async function createGroup({name, creator, createTime }) {
    if(!name) return {msg: '组名不能为空', status: 400};
    let user = await User.findOne({_id: creator});
    if(!user) return {msg: '此用户不存在', status: 400};
    let group = await Group.findOne({name});
    if(group) return {msg: '该群组已存在', status: 400};
    let newGroup = null;
    let newMessage = null;
    try {
        newGroup= await Group.create({
            name,
            creator,
            createTime,
            avatar: util.getRandomAvatar(),
            members: [creator]
        })
        newMessage = await Message.create({
            to: newGroup._id,
            style: 'system',
            content: user.username + '加入群聊',
            createTime: new Date()
        })
    } catch(err) {
        throw err;
    }
    return {
        _id: newGroup._id,
        name: newGroup.name,
        desc: newGroup.desc,
        avatar: util.getAvatarData(newGroup.avatar),
        creator: newGroup.creator,
        createTime: newGroup.createTime,
        message: {
            _id: newMessage._id,
            style: newMessage.style,
            content: newMessage.content,
            createTime: newMessage.createTime,
            to: newMessage.to,
        }
    }
}

/**
 * 加入群组
 * @param userId
 * @param groupId
 * @returns {Promise<{msg: string}|{msg: string, data: {}}|{msg: string}>}
 */
async function joinGroup({userId, groupId}) {
    let user = await User.findOne({_id: userId});
    let group = await Group.findOne({_id: groupId});

    if(!group) return {msg: '加入群组失败，该群组不存在', status: 400}
    if(group.members.indexOf(user._id) > -1) return {msg: '你已在群组中', status: 400};
    group.members.push(user);
    await group.save();
    let newMessage = await Message.create({
        to: group._id,
        style: 'system',
        content: user.username + '加入群聊',
        createTime: new Date()
    })
    return {
        ...convertGroupMsg(group),
        createTime: group.createTime,
        type: 1,
        message: {
            _id: newMessage._id,
            style: newMessage.style,
            content: newMessage.content,
            createTime: newMessage.createTime,
            to: newMessage.to,
        }
    }

}

/**
 * 解散群组
 * @param data
 * @returns {Promise<{id: *}|{msg: string, status: number}|{msg: string, status: number}>}
 */
async function delGroup(data) {
    let result;
    try {
        result = await Group.deleteOne({_id: data, isDefault: false})
    } catch(error) {
        if(error) return {status: 400, msg: '该群组不存在或你没有此权限'}
    }
    if(result.n === 0) return {status: 400, msg: '默认群组不能解散'}
    return {
        id: data
    }
}

/**
 * 获取默认群组信息
 * @returns {Promise<{}|*>}
 */
async function getDefaultGroup() {
    const group = await Group.findOne({isDefault: true})
    if(group) return group
    else return {}
}

/**
 * 搜索群组
 * @param data
 * @returns {Promise<*>}
 */
async function searchGroup(data) {
    const reg = new RegExp(data.keyword)
    let groups = await Group.find({name: {$regex: reg, $options: 'i'}})
    groups = groups.map(group => {
        return convertGroupMsg(group)
    })
    return groups;
}

/**
 * 获取群组成员
 * @param data
 * @returns {Promise<{_id: *, tag: *, avatar, username: *}[]|boolean>}
 */
async function getGroupMembers(data) {
    const group = await Group.findOne({ name: data })
    if(!group) return false
    const promises = group.members.map(id => {
        return User.findOne({_id: id})
    })
    const results = await Promise.all(promises)
    const users = results.map(user => convertUserMsg(user))
    return users
}

/**
 * 转换群组对象
 * @param group
 * @returns {{membersNum: number, creator: (*|creator|{ref, type}|number), name: *, _id: *, avatar}}
 */
function convertGroupMsg(group) {
    const reg = /base64/g;
    !reg.test(group.avatar) && (group.avatar = util.getAvatarData(group.avatar))
    return {
        _id: group._id,
        name: group.name,
        avatar: group.avatar,
        membersNum: group.members.length,
        creator: group.creator
    }
}

/**
 * 转换用户对象
 * @param user
 * @returns {{_id: *, tag: *, avatar, username: *}}
 */
function convertUserMsg(user) {
    const reg = /base64/g;
    !reg.test(user.avatar) && (user.avatar = util.getAvatarData(user.avatar))
    return {
        _id: user._id,
        tag: user.tag,
        username: user.username,
        avatar:  user.avatar,
    }
}

module.exports = {
    createGroup,
    joinGroup,
    getDefaultGroup,
    searchGroup,
    getGroupMembers,
    delGroup
}
