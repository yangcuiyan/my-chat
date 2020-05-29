<template>
  <div
    v-if="type === 'mine' || type === 'other'"
    :class="['msg-info', {mine: type === 'mine'}]">
    <img :src="info.img" alt="" class="avatar">
    <div class="user-info">
      <div class="info">
        <span class="tag" v-if="info.tag">{{ info.tag }}</span>
        <span class="name">{{ info.name }}</span>
        <span class="time">{{ info.time }}</span>
      </div>
      <div class="msg" v-if="info.style === 'text'">
        {{ info.content }}
        <span class="arrow"></span>
      </div>
      <div class="msg" v-if="info.style === 'emoji'" v-html="emoji">
        {{ info.content }}
        <span class="arrow"></span>
      </div>
      <div class="msg" v-else-if="info.style === 'file'">
        <div class="file">
          {{ info.filename }}
        </div>
        <a :href="info.file" :download="info.filename" class="download">下载</a>
        <span class="arrow"></span>
      </div>
      <div class="msg" v-else-if="info.style === 'image'">
        <img :src="info.content" alt="" class="show-img" :style="{width: info.fileWidth + 'px', height: info.fileHeight + 'px'}">
        <span class="arrow"></span>
      </div>
      <div class="msg" v-else-if="info.style === 'invite'">
        {{ info.content }}
        <span class="add-group">加入</span>
        <span class="arrow"></span>
      </div>
    </div>
  </div>
  <div v-else class="org">
    系统消息：<span>{{info.content}}</span>
  </div>
</template>
<script>
import getEmoji from '@/util/getEmoji'
export default {
  name: 'messageItem',
  props: ['type', 'info'],
  data () {
    return {
      emoji: ''
    }
  },
  mounted () {
    if (this.info.style === 'file') {
      const buffer = Buffer.from(JSON.parse(this.info.content))
      const blob = new Blob([buffer])
      const url = URL.createObjectURL(blob)
      this.info.file = url
    } else if (this.info.style === 'emoji') {
      const html = getEmoji(this.info.content)
      this.emoji = html
    }
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>

  .msg-info {
  margin: 15px 0px 15px 10px;
  display: flex;
  position: relative;

  img.avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
  .user-info {
    flex: 1;
    display: inline-block;
    font-size: 12px;
    vertical-align: top;
    color: #666;
    max-width: 80%;
    .info {
      margin-left: 5px;
      margin-bottom: 5px;
      span {
        margin-left: 5px;

        &.tag {
          background-color: lightpink;
          border-radius: 4px;
          padding: 1px 4px;
          color: #fff;
        }
      }
    }
    .msg {
      display: inline-block;
      background-color: #fff;
      margin-left: 14px;
      padding: 6px 8px;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 0 8px 8px 8px;
      word-break: break-word;
      position: relative;
      text-align: center;
      .download {
        margin-top: 5px;
      }
      .show-img {
        max-width: 90%;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 2px;
      }
      .add-group {
        display: block;
        cursor: pointer;
      }
    }

    .arrow {
      position: absolute;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 7px 14px 0px;
      border-bottom-color: transparent;
      border-right-color: #fff;
      left: -7px;
      top: 0px;
    }
  }

  &.mine {
    flex-direction: row-reverse;
    justify-content: flex-start;
    margin: 15px 10px 15px 0;
    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-right: 10px;
      .info {
        display: flex;
        flex-direction: row-reverse;
      }

      .msg {
        border-radius: 8px 0px 8px 8px;
        margin-right: 5px;
        .arrow {
          right: -7px;
          left: initial;
          border-width: 0 0 15px 7px;
          border-color: transparent transparent transparent #fff;
        }
      }
    }
  }
}
.org {
  text-align: center;
  color: #666;
  font-size: 12px;
  margin: 10px;
}
</style>
