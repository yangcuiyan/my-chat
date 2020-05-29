import convertMessage from '@/util/convertMessage'
import { Message } from 'element-ui'

const state = {
  userInfo: {
    _id: '',
    username: '',
    avatar: '',
    isAdmin: '',
    linkmans: [],
    focus: {}
  },
  friendSystemMessage: new Map()
}

const getters = {
}

const mutations = {
  setUserInfo (state, user) {
    state.userInfo = {
      _id: user._id,
      username: user.username,
      avatar: user.avatar,
      isAdmin: user.isAdmin
    }
  },
  setLinkmans (state, { groups, friends, messages }) {
    let linkmans = [
      ...groups.map(group => ({
        _id: group._id,
        name: group.name,
        avatar: group.avatar,
        creator: group.creator,
        createTime: group.createTime,
        unReadNum: 0, // 未读信息数量
        type: 1 // 0表示好友，1表示群组
      })),
      ...friends.map(friend => {
        const flag = friend.from === state.userInfo._id
        return {
          _id: friend.relationId,
          name: flag ? friend.to.username : friend.fromUser.username,
          avatar: flag ? friend.to.avatar : friend.fromUser.avatar,
          createTime: friend.createTime,
          unReadNum: 0,
          type: 0
        }
      })
    ]
    linkmans = linkmans.map((linkman, i) => {
      linkman.lastMsg = messages[i][linkman._id]
      return linkman
    })
    if (linkmans.length > 0) {
      state.userInfo = {
        ...state.userInfo,
        focus: linkmans[0]
      }
    }
    state.userInfo = {
      ...state.userInfo,
      linkmans: linkmans
    }
    console.log(state.userInfo)
  },
  setFocus (state, linkman) {
    state.userInfo = {
      ...state.userInfo,
      focus: linkman
    }
  },
  setFriendSystemMessage (state, data) {
    state.friendSystemMessage.clear()
    state.friendSystemMessage = data
  },
  socket_setFocusMessage (state, { message }) {
    const mes = convertMessage(message, state.userInfo.username)
    if (message.to !== state.userInfo.focus._id) {
      state.userInfo = {
        ...state.userInfo,
        linkmans: state.userInfo.linkmans.map(linkman => {
          if (linkman._id === message.to) {
            linkman.lastMsg = mes
            linkman.unReadNum++
          }
          return linkman
        })
      }
    } else {
      const focusMes = state.userInfo.focus.messages || []
      state.userInfo = {
        _id: state.userInfo._id,
        username: state.userInfo.username,
        avatar: state.userInfo.avatar,
        isAdmin: state.userInfo.isAdmin,
        focus: {
          ...state.userInfo.focus,
          messages: [
            ...focusMes,
            mes
          ]
        },
        linkmans: state.userInfo.linkmans.map(linkman => {
          // if (linkman._id === state.userInfo.focus._id) linkman.unReadNum = unReadNum
          linkman._id === state.userInfo.focus._id && (linkman.lastMsg = mes)
          return linkman
        })
      }
    }
  },
  socket_joined (state, data) {
    const mes = data.messages.map(message => {
      return convertMessage(message, state.userInfo.username)
    })
    !state.userInfo.linkmans && (state.userInfo.linkmans = [])
    state.userInfo = {
      ...state.userInfo,
      focus: {
        ...state.userInfo.focus,
        isBottom: true,
        messages: mes
      },
      linkmans: state.userInfo.linkmans.map(linkman => {
        if (linkman._id === state.userInfo.focus._id) {
          linkman.lastMsg = mes[mes.length - 1]
          linkman.unReadNum = 0
        }
        return linkman
      })
    }
  },
  socket_addLinkman (state, data) {
    if (data.status === 400) {
      Message({
        message: data.msg,
        type: 'error',
        duration: 3 * 1000
      })
      return false
    }
    let group
    data.type !== 0 && (group = {
      _id: data._id,
      name: data.name,
      avatar: data.avatar,
      creator: data.creator,
      createTime: data.createTime,
      unReadNum: 0, // 未读信息数量
      type: 1, // 0表示好友，1表示群组
      lastMsg: convertMessage(data.message),
      messages: [data.message]
    })
    data.type === 0 && (group = data)
    state.userInfo = {
      ...state.userInfo,
      focus: {
        isBottom: true,
        ...state.userInfo.focus,
        ...group
      },
      linkmans: [
        ...state.userInfo.linkmans,
        group
      ]
    }
  },
  socket_delLinkman (state, data) {
    console.log(data)
    if (data.status === 400) {
      Message({
        message: data.msg,
        type: 'error',
        duration: 3 * 1000
      })
      return false
    }
    const linkmans = state.userInfo.linkmans.filter(linkman => {
      return linkman._id !== data.id
    })
    state.userInfo = {
      ...state.userInfo,
      linkmans: linkmans
    }
  },
  socket_setFriendSystemMessage (state, friends) {
    const flag = Object.prototype.toString.call(friends) === '[object Array]'
    flag && friends.forEach(friend => {
      state.friendSystemMessage.set(friend.id.toString(), friend)
    })
    !flag && state.friendSystemMessage.set(friends.id.toString(), friends)
    state.friendSystemMessage = new Map(state.friendSystemMessage)
  },
  socket_getHistoryMessages (state, messages) {
    const mes = messages.map(message => {
      return convertMessage(message, state.userInfo.username)
    })
    state.userInfo = {
      ...state.userInfo,
      focus: {
        ...state.userInfo.focus,
        isBottom: false,
        messages: [
          ...mes,
          ...state.userInfo.focus.messages
        ]
      }
    }
  },
  socket_setGroupMembers (state, members) {
    state.userInfo = {
      ...state.userInfo,
      focus: {
        ...state.userInfo.focus,
        members: members
      }
    }
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
