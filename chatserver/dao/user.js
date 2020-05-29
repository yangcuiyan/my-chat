const bcrypt = require("bcryptjs");
const jwt = require("jwt-simple");
const User = require("../model/user");
const Group = require("../model/group");
const Friend = require("../model/friend");
const Message = require("../model/message");
const util = require("../util/getRandomAvatar");
const config = require('../config');

/**
 * 生成Token
 * @param userId
 * @param environment
 * @returns {string}
 */
function generateToken(userId, environment = 'web') {
    return jwt.encode({
        user: userId,
        environment,
        expires: Date.now() + config.tokenExpiresTime
    }, config.jwtSecret);
}

/**
 * 注册新用户
 * @param name
 * @param password
 * @param environment
 * @returns {Promise<{msg: string, code: number, data: *}|{msg: string}|{msg: string}>}
 */
async function register({username, password}) {
    const user = await User.findOne({ username });
    if(user) return { msg: "此用户名已存在", status: 400 };
    const defaultGroup = await Group.findOne({ isDefault: true});
    if(!defaultGroup) return { msg: "默认群组不存在", status: 400 }
    //加密盐
    const salt = bcrypt.genSaltSync(config.saltLength);
    //密码转成hash值
    const hash = bcrypt.hashSync(password, salt);
    let newUser = null;
    try {
        newUser = await User.create({
            username,
            password: hash,
            salt,
            avatar: util.getRandomAvatar()
        });
    } catch(err) {
        throw err;
    }
    if(!defaultGroup.creator) {
        defaultGroup.creator = newUser
    }
    defaultGroup.members.push(newUser);
    await defaultGroup.save();
    let message = null;
    try {
        message = await Message.create({
            to: defaultGroup._id,
            style: 'system',
            content: newUser.username + '加入群聊',
            createTime: new Date()
        })
    } catch (err) {
        console.log(err)
    }
    return {
        status: 200,
        msg: '注册成功！'
    }
}

/**
 * 账号密码登录
 * @param name
 * @param password
 * @param environment
 * @returns {Promise<{msg: string, data: {name: *, groups: *, avatar: (string|*|number|StringConstructor|String|avatar), friends: *}, token: string}|{msg: string}>}
 */
async function loginByNameAndPass({username, password}) {
    let user = await User.findOne({ username });
    if(!user) return { msg: '无效的用户名或密码', status: 400};
    const isPassCorrect = bcrypt.compareSync(password, user.password);
    if(!isPassCorrect) return { msg: '无效的用户名或密码', status: 400 };
    user.lastLoginTime = Date.now();
    await user.save();
    let groupArr = await Group.find({ members: user }, {
        _id: 1,
        name: 1,
        avatar: 1,
        creator: 1,
        createTime: 1
    });
    groupArr = groupArr.map(group => {
        const reg = /base64/g;
        !reg.test(group.avatar) && (group.avatar = util.getAvatarData(group.avatar))
        return group
    })
    const reg = new RegExp(user._id.toString())
    let friendArr = await Friend.find({ relationId: reg, status: 1 }).populate("to", {
        _id: 1,
        avatar: 1,
        username: 1,
        tag: 1
    }).populate("from", {
        _id: 1,
        avatar: 1,
        username: 1,
        tag: 1
    })
    friendArr = friendArr.map(friend => {
        const reg = /base64/g;
        !reg.test(friend.to.avatar) && (friend.to.avatar = util.getAvatarData(friend.to.avatar))
        !reg.test(friend.from.avatar) && (friend.from.avatar = util.getAvatarData(friend.from.avatar))
        return {
            _id: friend._id,
            createTime: friend.createTime,
            status: friend.status,
            relationId: friend.relationId,
            from: friend.from._id,
            fromUser: {
                username: friend.from.username,
                avatar: friend.from.avatar,
                tag: friend.from.tag
            },
            to: {
                _id: friend.to._id,
                username: friend.to.username,
                avatar: friend.to.avatar,
                tag: friend.to.tag
            }
        }
    })

    let token = generateToken(user._id.toString());
    config.token = token
    return {
        status: 200,
        msg: '登陆成功',
        token,
        data: {
            _id: user._id,
            username: user.username,
            avatar: util.getAvatarData(user.avatar),
            groups: groupArr,
            friends: friendArr,
            isAdmin: user._id.toString() === config.administrator
        }
    }
}

/**
 * token登录
 * @param token
 * @returns {Promise<{msg: string, status: number}|{data: {name: *, groups: *, avatar: (string|number|*|string|StringConstructor|String), isAdmin: boolean, friends: *}, status: number, token: *}|{msg: string, status: number}|{msg: string, status: number}>}
 */
async function loginByToken(token) {
    let payload = null;
    try {
        payload = jwt.decode(token, config.jwtSecret);
    } catch(err) {
        return { msg: "非法token", status: 401};
    }
    if(Date.now() > payload.expires) return { msg: "token失效了，请重新登陆", status: 401 }
    let user = await User.findOne({ _id: payload.user });
    if(!user) return { msg: '此用户不存在', status: 401 }
    user.lastLoginTime = Date.now();
    await user.save();
    let groupArr = await Group.find({ members: user }, {
        _id: 1,
        name: 1,
        avatar: 1,
        creator: 1,
        createTime: 1
    });
    groupArr = groupArr.map(group => {
        const reg = /base64/g;
        !reg.test(group.avatar) && (group.avatar = util.getAvatarData(group.avatar))
        return group
    })
    const reg = new RegExp(user._id.toString())
    let friendArr = await Friend.find({ relationId: {$regex: reg}, status: 1 }).populate('to from', {
        _id: 1,
        avatar: 1,
        username: 1,
        tag: 1
    })
    friendArr = friendArr.map(friend => {
        const reg = /base64/g;
        !reg.test(friend.to.avatar) && (friend.to.avatar = util.getAvatarData(friend.to.avatar))
        !reg.test(friend.from.avatar) && (friend.from.avatar = util.getAvatarData(friend.from.avatar))
        return {
            _id: friend._id,
            createTime: friend.createTime,
            status: friend.status,
            relationId: friend.relationId,
            from: friend.from._id,
            fromUser: {
                username: friend.from.username,
                avatar: friend.from.avatar,
                tag: friend.from.tag
            },
            to: {
                _id: friend.to._id,
                username: friend.to.username,
                avatar: friend.to.avatar,
                tag: friend.to.tag
            }
        }
    })
    return {
        status: 200,
        data: {
            _id: user._id,
            username: user.username,
            avatar:  util.getAvatarData(user.avatar),
            groups: groupArr,
            friends: friendArr,
            isAdmin: user._id.toString() === config.administrator
        }
    }

}

/**
 * 根据用户名查找用户
 * @param data
 * @returns {Promise<*>}
 */
async function searchFriend(data) {
    const reg = new RegExp(data.keyword)
    let users = await User.find({username: {$regex: reg, $options: 'i'}})
    users = users.map(user => {
        return convertUserMsg(user)
    })
    return users;
}

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
    register,
    loginByNameAndPass,
    loginByToken,
    searchFriend
}
