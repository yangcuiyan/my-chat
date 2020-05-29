import utilTime from './time'
export default function convertMessage (message, username) {
  if (!message) return false
  message.from ? message.from.username === username ? (message.type = 'mine') : (message.type = 'other') : (message.type = 'org')
  const msg = {}
  if (message.type === 'org') {
    msg.type = 'org'
  } else if (message.type === 'mine') {
    msg.type = 'mine'
    msg.tag = message.from && message.from.tag
    msg.name = message.from && message.from.username
    msg.img = message.from && message.from.avatar
  } else if (message.type === 'other') {
    msg.type = 'other'
    msg.tag = message.from && message.from.tag
    msg.name = message.from && message.from.username
    msg.img = message.from && message.from.avatar
  }
  msg.content = message.content
  msg._id = message._id
  msg.time = utilTime.getExactTime(new Date(message.createTime), new Date())
  msg.createTime = message.createTime
  msg.style = message.style
  msg.file = message.file
  msg.filename = message.filename
  msg.fileWidth = message.fileWidth
  msg.fileHeight = message.fileHeight
  return msg
}
