const friendDao = require('../dao/friend')

function addFriend(data) {
    return friendDao.addFriend(data)
}

function updateFriend(data) {
    return friendDao.updateFriend(data)
}

function findFriendByToIds(data) {
    return friendDao.findFriendByToIds(data)
}

function findFriendByTo(data) {
    return friendDao.findFriendByTo(data)
}

module.exports = {
    addFriend,
    updateFriend,
    findFriendByToIds,
    findFriendByTo
}