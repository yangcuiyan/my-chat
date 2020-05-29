const groupController = require('./group');
const messageController = require('./message');
const userController = require('./user')
const friendController = require('./friend')
const expressionController = require('./expression')

module.exports = {
    ...groupController,
    ...messageController,
    ...userController,
    ...friendController,
    ...expressionController
}