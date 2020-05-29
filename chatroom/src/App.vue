<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  @import './assets/css/base.less';
  .el-form-item__error {
    margin-left: 60px;
  }
  #app {
    span.emoji-item {
      display: inline-block;
      width: 30px;
      height: 30px;
      background-image: url("./assets/img/emoji.png");
      background-size: 30px auto;
      background-repeat: no-repeat;
    }

    .el-upload-list {
      display: none;
    }
    .el-button--primary {
      background-color: var(--primary-color-10);
      color: var(--primary-text-color-10);
      border: none;
    }
    .search-btn {
      &.el-button--primary {
        background-color: var(--primary-color-10);
        color: var(--primary-text-color-10);
        border: none;
      }
    }
    .c-search-wrapper {
      .el-input__inner {
        -webkit-border-radius: 18px;
        -moz-border-radius: 18px;
        border-radius: 18px;
        outline: none;
        font-size: 16px;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.5);
        color: #333;
        border: none;

        &:focus {
          border-color: var(--primary-color-10);
        }
      }
      .el-input__icon {
        font-size: 24px;
        color: #666;
      }
      input::placeholder {
        color: #666;
      }
      .el-tabs__header {
        margin: 0 0 8px;
      }
    }
    .group-info {
      .group-name {
        .el-input__inner:focus {
          border-color: var(--primary-color-10);
        }
      }
    }
    .add-friend-dialog {
      .el-dialog__body {
        background-color: #f0f2f5;
        padding: 20px;
        margin-bottom: 5px;
      }
      .el-dialog__header {
        background-color: #f0f2f5;
      }
    }
    .personal-info-dialog {
      .el-dialog__body {
        padding: 10px 20px;
      }
      .el-dialog__header {
        border-bottom: 1px solid #e9e9e9;
      }
      .el-input__inner:focus {
        border-color: var(--primary-color-10);
      }
      .el-dialog {
        height: 400px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 0px;
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
      }
    }
    .system-message-dialog {
      .el-dialog__body {
        padding: 10px 20px;
      }
    }
    .create-group-dialog {
      .el-dialog__body {
        padding: 10px 20px;
      }
      .el-dialog__header {
        border-bottom: 1px solid #e9e9e9;
      }
      .el-input {
        .el-input__clear {
          font-size: 24px;
        }
      }
      .el-input__inner {
        border: 1px solid rgba(0, 0, 0, 0.2);
        &:focus {
          border-color: var(--primary-color-10);
        }
      }
    }
  }
</style>
