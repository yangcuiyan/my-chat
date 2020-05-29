<template>
  <el-dialog
    title="个人信息设置"
    :visible.sync="dialogVisible"
    width="500px"
    label-width="150"
  class="personal-info-dialog">
    <el-form ref="form" :model="form">
      <el-form-item label="修改头像" class="alter-avatar">
        <el-upload
          v-if="hasImage"
          :show-file-list="false"
          action="https://jsonplaceholder.typicode.com/posts/"
          :before-upload="beforeUpload"
          accept=".jpeg, .jpg, .png"
          class="upload-img"
        >
          <img :src="avatar" alt="">
        </el-upload>
        <div v-if="showVueCropper" class="cropper1">
          <VueCropper
            ref="cropper"
            :img="option.img"
            :output-size="option.outputSize"
            :output-type="option.outputType"
            :info="option.info"
            :can-scale="option.canScale"
            :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :fixed="option.fixed"
            :center-box="option.centerBox"
            :fixed-number="option.fixedNumber"
            :max-img-size="option.maxImgSize"
            :full="option.full"
            :high="option.high"
            :can-move="option.canMove"
            :mode="option.mode"
            @realTime="realTime"
          />
        </div>
        <el-button type="primary" @click="alterAvatar">修改头像</el-button>
      </el-form-item>
      <el-form-item label="修改用户名" class="alter-username">
        <el-input placeholder="用户名" clearable v-model="username"></el-input>
        <el-button type="primary">确认修改</el-button>
      </el-form-item>
      <el-form-item label="修改密码" class="alter-password">
        <el-input placeholder="旧密码" clearable v-model="form.oldPass"></el-input>
      </el-form-item>
      <el-form-item class="alter-password">
        <el-input placeholder="新密码" clearable v-model="form.newPass"></el-input>
        <el-button type="primary">修改密码</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { VueCropper } from 'vue-cropper'
import { mapState } from 'vuex'
export default {
  name: 'personalInfoDialog',
  props: ['value'],
  components: {
    VueCropper
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        username: '',
        oldPass: '',
        newPass: ''
      },
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 180, // 默认生成截图框宽度
        autoCropHeight: 180, // 默认生成截图框高度
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        centerBox: true, // 截图框是否被限制在图片里面
        canMoveBox: true, // 截图框能否拖动
        maxImgSize: 3000,
        full: true,
        canMove: true,
        mode: 'contain'
      },
      hasImage: true,
      showVueCropper: false
    }
  },
  watch: {
    value (newVal) {
      this.dialogVisible = newVal
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  computed: {
    ...mapState(['userInfo']),
    avatar () {
      return this.$store.state.user.userInfo.avatar
    },
    username () {
      return this.$store.state.user.userInfo.username
    }
  },
  methods: {
    beforeUpload (file) {
      this.name = file.name
      this.option.img = URL.createObjectURL(file)
      this.showVueCropper = true
      this.hasImage = false
      return false
    },
    realTime (data) {
      this.dealImage(data, 60, 60)
    },
    dealImage (realData, width, height) {
      const previews = realData
      const h = width / realData.w

      this.previewStyle = {
        width: previews.w + 'px',
        height: previews.h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: h
      }
      this.previews = realData
    },
    alterAvatar () {
      // 获取截图的base64 数据
      this.$refs.cropper.getCropData(data => {
        console.log(data, this.previews)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.personal-info-dialog {
  .alter-avatar {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .upload-img {
      img {
        width: 100px;
        height: 100px;
      }
    }
    .cropper1 {
      width: 460px;
      height: 460px;
    }
  }
  .alter-username {
    .el-button {
      margin-top: 10px;
    }
  }
  .alter-password {
    margin-bottom: 10px;
    .el-button {
      margin-top: 10px;
    }
  }

}
</style>
