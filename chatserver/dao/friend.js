const Friend = require('../model/friend')
const { getAvatarData } = require('../util/getRandomAvatar')

async function addFriend({id, from, to}) {
    if (from.username === to.username) return { status: 400, msg: '不能添加自己为好友' }
    let friend = await Friend.findOne({ relationId: id, status: 1 })
    if (friend) return { status: 400, msg: '你们已经是好友了' }
    friend = await Friend.findOne({ relationId: id, status: 0 })
    if(friend && friend.from.toString() !== from._id) return {status: 400, msg: '对方正在请求添加你为好友，请进行回复'}
    else if(friend) return {
        id: friend.relationId,
        from: friend.from,
        to: friend.to,
        createTime: friend.createTime,
        status: friend.status
    }
    let newFriend = null;
    try {
        newFriend = await Friend.create({
            relationId: id,
            from: from,
            to: to,
            createTime: new Date(),
            status: 0
        })
    } catch(err) {
        console.log(err)
    }
    return {
        id: newFriend.relationId,
        from: newFriend.from,
        to: newFriend.to,
        createTime: newFriend.createTime,
        status: newFriend.status
    }
}

async function updateFriend({ id, status }) {
    const friend = await Friend.findOne({ relationId: id })
    friend.status = status
    friend.save();
    return friend
}

async function findFriendByToIds(ids) {
    const promises = ids.map(id => {
        return Friend.find({$or: [{to: id}, {from: id}]}).populate('from', {
            _id: 1,
            username: 1,
            avatar: 1,
            tag: 1
        }).populate('to', {
            _id: 1,
            username: 1,
            avatar: 1,
            tag: 1
        })
    })
    let results = await Promise.all(promises)
    results = ids.reduce((result, id, index) => {
        let relationId
        results[index] = results[index].map(friend => {
            friend = convertFriend(friend)
            relationId = friend.id
            return friend
        })
        result[relationId] = results[index]
        return result
    }, {})
    return results
}

async function findFriendByTo(id) {
    let friends = await Friend.find({to: id, status: 0}).populate('from', {
        _id: 1,
        username: 1,
        avatar: 1,
        tag: 1
    }).populate('to', {
        _id: 1,
        username: 1,
        avatar: 1,
        tag: 1
    })
    friends = friends.map(friend => {
        return convertFriend(friend)
    })
    return friends
}

function convertFriend(friend) {
    const reg = /base64/g;
    !reg.test(friend.from.avatar) && (friend.from.avatar = getAvatarData(friend.from.avatar))
    !reg.test(friend.to.avatar) && (friend.to.avatar = getAvatarData(friend.to.avatar))
    return {
        id: friend.relationId,
        from: {
            _id: friend.from._id,
            username: friend.from.username,
            avatar: friend.from.avatar,
            tag: friend.from.tag
        },
        to: {
            _id: friend.to._id,
            username: friend.to.username,
            avatar: friend.to.avatar,
            tag: friend.to.tag
        },
        createTime: friend.createTime,
        status: friend.status
    }
}

module.exports = {
    addFriend,
    updateFriend,
    findFriendByToIds,
    findFriendByTo
}