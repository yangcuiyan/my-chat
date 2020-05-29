const messageDao = require('../dao/message')

function getCurLastMessage(id) {
    return messageDao.getCurLastMessage(id)
}

function saveMessages (data) {
    return messageDao.saveMessages(data)
}

const getLinkmansLastMessages = async (req, res) => {
    const linkmanIds = req.body;
    const result = await messageDao.getLinkmansLastMessages(linkmanIds)
    res.status(200).send(result)
}

function getHistoryMessage(data) {
    return messageDao.getHistoryMessage(data)
}


module.exports = {
    getCurLastMessage,
    getLinkmansLastMessages,
    saveMessages,
    getHistoryMessage
}