import expression from './expression'
export default function getEmoji (content) {
  const reg = /#\(([\u4e00-\u9fa5a-z]+)\)/g
  const temp = content.replace(reg, (r, e) => {
    const index = expression.default.indexOf(e)
    if (index !== -1) {
      return `<span class="emoji-item" style="background-position: left ${-30 * index}px;"></span>`
    }
    return r
  })
  return temp
}
