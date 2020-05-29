const groupDao = require('../dao/group')

function getDefaultGroup() {
    return groupDao.getDefaultGroup()
}

/**
 * 创建群组
 * @param data
 * @returns {Promise<{msg: string, code: number, data: {creator: (*|creator|{ref, type}), name: *, avatar: (string|*|number|StringConstructor|String|avatar), desc: (*|desc|{default, match, type}|number|SVGDescElement)}}|{msg: string}>}
 */
function createGroup(data) {
    return groupDao.createGroup(data)
}

/**
 * 根据名称搜索群组
 * @param data
 * @returns {Promise<*>}
 */
function searchGroup(data) {
    return groupDao.searchGroup(data)
}

/**
 * 获取群组成员
 * @param data
 */
function getGroupMembers(data) {
    return groupDao.getGroupMembers(data)
}

/**
 * 加入群组
 * @param data
 * @returns {Promise<{msg: string}|{msg: string, data: {}}>}
 */
function joinGroup(data) {
    return groupDao.joinGroup(data)
}

/**
 * 解散群组
 * @param data
 * @returns {*|void}
 */
function delGroup(data) {
    return groupDao.delGroup(data)
}
module.exports = {
    getDefaultGroup,
    createGroup,
    searchGroup,
    getGroupMembers,
    joinGroup,
    delGroup
}