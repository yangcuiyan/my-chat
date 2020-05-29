<template>
  <div class="send-area">
    <div class="send-tool">
      <el-popover
        placement="top"
        width="400"
        trigger="click"
        class="dropdown">
        <el-tabs v-model="activeName" stretch @tab-click="handleClick">
          <el-tab-pane label="默认表情" name="defaultEmoji" class="default-emoji">
            <div class="expressions">
              <div class="emoji" v-for="(item, i) in emojis"  :key="i" :data-name="item"
                @click="selectEmoji(item)">
                <div class="emoji-item" :style="{backgroundPosition: `left ${-30 * i}px`}"></div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="搜索表情包" name="searchEmoji">
            <search-expression @selectExpression="selectExpression"/>
          </el-tab-pane>
        </el-tabs>
        <span class="iconfont icon-emoji" slot="reference"></span>
      </el-popover>
      <el-upload
        class="upload-file"
        action=""
        :before-upload="beforeImageUpload"
        accept=".jpeg, .jpg, .png, .gif">
        <span class="iconfont icon-img"></span>
      </el-upload>
      <el-upload
        class="upload-file"
        action=""
        :before-upload="beforeFileUpload"
        accept=".xls, .xlsx, .pdf, .txt, .doc, .docx, .ppt, .zip">
        <span class="iconfont icon-9wenjianchuanshu-1"></span>
      </el-upload>
    </div>
    <div class="msg-area">
      <textarea name="" id="" cols="30" rows="5" v-model="sendMsg" ref="chatInput"></textarea>
      <el-button type="primary" size="small" @click="sendMessage">发送</el-button>
      <el-button type="info" size="small">清空</el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { uploadFile, uploadImage } from '@/api/message'
import defaultEmoji from '@/util/expression'
import SearchExpression from './SearchExpression'
export default {
  name: 'sendMsgArea',
  components: {
    SearchExpression
  },
  data () {
    return {
      sendMsg: '',
      activeName: 'defaultEmoji',
      emojis: defaultEmoji.default
    }
  },
  computed: {
    ...mapState(['userInfo']),
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    sendMessage (data) {
      const reg = /#\([\u4e00-\u9fa5a-z]+\)/g
      const flag = reg.test(this.sendMsg)
      const sendData = {
        content: data.content || this.sendMsg,
        to: this.userInfo.focus._id,
        from: this.userInfo._id,
        fromUser: this.userInfo.username,
        filename: data.filename,
        fileWidth: data.fileWidth,
        fileHeight: data.fileHeight,
        style: data.style || (flag ? 'emoji' : 'text') || 'text',
        createTime: new Date()
      }
      if (this.sendMsg.indexOf('invite::') > -1) {
        sendData.style = 'invite'
        sendData.content = `${this.userInfo.username}邀请你加入群组[${this.userInfo.focus.name}]`
      }
      this.$socket.emit('message', sendData)
      this.sendMsg = ''
    },
    async beforeFileUpload (file) {
      const reg = /(.ppt)|(.txt)|(.pdf)|(.xls)|(.xlsx)|(.doc)|(.docx)|(.zip)$/
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!reg.test(file.name)) {
        this.$message.error('上传文件只能是 xls,xlsx,ppt,doc,docx,zip,txt,pdf 格式！')
      }
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      const formData = new FormData()
      formData.append('file', file)
      const data = await uploadFile(formData)
      const sendData = {
        style: 'file',
        content: data.path,
        filename: file.name
      }
      this.sendMessage(sendData)
      return false
    },
    async beforeImageUpload (file) {
      const reg = /(.png)|(.jpeg)|(.jpg)|(.gif)$/
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!reg.test(file.name)) {
        this.$message.error('上传图片只能是 png,jpeg,jpg,gif 格式！')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      const formData = new FormData()
      formData.append('file', file)
      const data = await uploadImage(formData)
      const sendData = {
        style: 'image',
        content: data.path,
        filename: file.name
      }
      this.sendMessage(sendData)
      return false
    },
    selectEmoji (item) {
      this.sendMsg += `#(${item})`
      this.$refs.chatInput.focus()
    },
    selectExpression (expression) {
      console.log(expression)
      const sendData = {
        style: 'image',
        content: expression.image,
        filename: '[image]',
        fileWidth: expression.width,
        fileHeight: expression.height
      }
      this.sendMessage(sendData)
    }
  },
  sockets: {
    setFocusMessage () {
      console.log('setFocusMessage')
    }
  }
}
</script>
<style lang="less" scoped>
  .expressions {
    position: relative;
    height: 200px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 20px;
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: rgba(0,0,0,0.2);
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 20px;
      background: rgba(0,0,0,0.1);
    }
    .emoji {
      width: 40px;
      height: 40px;
      padding: 5px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      &:hover {
        background-color: #e9e9e9;
        cursor: pointer;
      }
      .emoji-item {
        background-image: url('../../assets/img/emoji.png');
        background-size: 30px auto;
        background-repeat: no-repeat;
        width: 30px;
        height: 30px;
      }
    }
  }

  .send-area {
    height: 180px;
    background-color: rgba(255, 255, 255, 0.5);
    .send-tool {
      color: #666;
      .default-emoji {
        height: 200px;
      }

      .upload-file {
        display: inline-block;
      }
      span {
        font-size: 24px;
        margin: 5px 0px 5px 10px;
        cursor: pointer;
        &:hover {
          color: var(--primary-color-10);
        }
      }
    }
    .msg-area {
      textarea {
        background-color: transparent;
        width: 100%;
        box-sizing: border-box;
        height: 110px;
        border: none;
        outline: none;
        resize:none;
        font-size: 16px;
        padding: 10px;
      }
      .el-button {
        float: right;
        margin: 2px 10px 2px 0px;
      }
    }
  }
</style>
