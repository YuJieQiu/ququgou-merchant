//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    activeNames: ['1'],
    homeData: {}
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    })
  },
  getHomeInfo() {
    app.httpGet('get/home/info', {}).then(res => {
      this.setData({
        homeData: res.data
      })
    })
  },
  onLoad: function () {
    this.getHomeInfo()
  },
  getUserInfo: function (e) { }
})
