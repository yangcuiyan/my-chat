require('./main')
const path = require("path");
const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const session = require("express-session");
const bodyParser = require('body-parser')

const config = require("./config");
const captcha = require("./router/captcha");
const user = require("./router/user");
const message = require("./router/message");
const upload = require("./router/upload");

app.use(session({
    secret: 'keyboard cat',//使用随机自定义字符串进行加密
    resave: false,//即使 session 没有被修改，也保存 session 值，默认为 true
    saveUninitialized: true,//不保存未初始化的cookie，也就是未登录的cookie
    cookie: { secure: false }
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())//中间件只会解析 json ，允许请求提任意Unicode编码支持 gzip 和 deflate 编码
app.use(bodyParser.urlencoded({extended: false}))
app.use('/upload', upload)
app.use('/getImageCode', captcha);
app.use('/', user);
app.use('/m', message);
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

const apiList = require('./controller/apiList')
const onlineUsers = new Map()
io.on("connection", async socket => {
    const defaultGroup = await apiList.getDefaultGroup()

    //将连接到后端的用户socket和userId保存起来,并且发送好友通知
    socket.on('init', async ({socketId, userId}) => {
        onlineUsers.set(userId.toString(), socket)
        const friends = await apiList.findFriendByTo(userId)
        friends.forEach(friend => {
            console.log(friend.to._id.toString(), userId.toString())
            friend.to._id.toString() === userId.toString() && socket.join(friend.id, () => {
                socket.emit('setFriendSystemMessage', friend)
            })
        })
    })

    // 用户点击列表进入聊天界面
    socket.on('join', async userInfo => {
        const type = userInfo.focus.type // 1表示群组， 0表示好友
        const id = userInfo.focus._id   //id
        const linkmans = userInfo.linkmans
        let messages = await apiList.getCurLastMessage(id, type)
        socket.join(id, () => {
            let rooms = Object.keys(socket.rooms)
            io.sockets.in(id).emit('joined', {id: id, messages: messages})//包括自己
            // socket.broadcast.to(defaultGroup._id).emit('joined', 'hh')//不包括自己
        })
        linkmans.forEach(linkman => {
            socket.join(linkman._id)
        })
    })
    socket.on('setFocus', async userInfo => {
        const type = userInfo.focus.type // 1表示群组， 0表示好友
        const id = userInfo.focus._id   //id
        let messages = await apiList.getCurLastMessage(id, type)
        socket.join(id, () => {
            socket.emit('joined', {id: id, messages: messages})
        })
    })
    //添加好友申请
    socket.on('addFriend', async data => {
        const friendR = await apiList.addFriend(data)
        if (friendR.status !== 400) {
            const id = data.id
            socket.join(id)
            const other = onlineUsers.get(data.to._id.toString())
            other && other.join(id)
            data.status = friendR.status
            socket.broadcast.to(id).emit('setFriendSystemMessage', data)
        }
        socket.emit('addFriendAfter', friendR)
    })

    //对方同意加为好友
    socket.on('agreeValidate', data => {
        const id = data.id
        socket.join(id, async () => {
            data.status = 1
            const friend = await apiList.updateFriend(data)
            const linkman = {
                _id: id,
                name: data.from.username,
                avatar: data.from.avatar,
                createTime: friend.createTime,
                type: 0
            }
            const otherLinkman = {
                _id: id,
                name: data.to.username,
                avatar: data.to.avatar,
                createTime: friend.createTime,
                type: 0
            }
            socket.emit('addLinkman', linkman)
            const otherSocket = onlineUsers.get(data.from._id.toString())
            otherSocket && otherSocket.join(id, () => {
                otherSocket.emit('addLinkman', otherLinkman)
            })
        })
    })

    //对方拒绝加为好友
    socket.on('refuseValidate', data => {
        const id = data.id
        socket.join(id, async () => {
            data.status = 2
            const friend = await apiList.updateFriend(data)
        })
    })


    // 发送消息
    socket.on('message', async data => {
        const message = await apiList.saveMessages(data)
        // io.emit('message', data);
        // socket.broadcast.emit('message',data);
        socket.emit('setFocusMessage', {message})
        socket.broadcast.to(message.to).emit('setFocusMessage', {message});
    })

    //创建群组
    socket.on('createGroup', async data => {
        const group = await apiList.createGroup(data)
        socket.join(group._id, () => {
            socket.emit('addLinkman', group)
        })
    })
    //加入群组
    socket.on('joinGroup', async data => {
        const result = await apiList.joinGroup(data)
        console.log(data)
        socket.join(data.groupId, () => {
            socket.emit('addLinkman', result)
            socket.broadcast.to(data.groupId).emit('setFocusMessage', {message: result.message})
        })
    })
    //解散群组
    socket.on('delGroup', async data => {
        const result = await apiList.delGroup(data)
        if (result.status) {
            socket.emit('delLinkman', result)
        } else {
            io.sockets.in(data).emit('delLinkman', result)
        }
    })

    //查找群组和用户
    socket.on('searchLinkmans', async data => {
        const users = await apiList.searchFriend(data)
        const groups = await apiList.searchGroup(data)
        socket.emit('searchResult', {users, groups})
    })


    socket.on('getHistoryMessages', async (focus) => {
        // console.log(focus)
        if (focus) {
            const id = focus._id
            const messages = await apiList.getHistoryMessage(id)
            socket.emit('getHistoryMessages', messages)
        }
    })

    socket.on('searchExpression', async keyword => {
        const res = await apiList.getExpression(keyword)
        socket.emit('getExpression', res)
    })

    socket.on('getGroupMembers', async name => {
        const members = await apiList.getGroupMembers(name)
        members && socket.emit('setGroupMembers', members)
    })

    socket.on('disconnect', () => {
        console.log('disconnect')
    })
})
server.listen(3000, () => {
    console.log('服务器在3000启动')
});

module.exports = {
    app,
    io,
    server
};

