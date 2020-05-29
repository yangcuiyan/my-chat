const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const publicPath = process.env.NODE_ENV === 'development' ? '/' : ''

module.exports = {
  publicPath,
  devServer: {
    port: 8088,
    publicPath,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'))
  }
}
