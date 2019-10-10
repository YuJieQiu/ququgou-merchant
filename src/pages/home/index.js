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
      wx.stopPullDownRefresh()
      this.setData({
        homeData: res.data
      })
    })
  },
  //上拉刷新
  onPullDownRefresh() {
    this.getHomeInfo()
  },
  onShow() {
    this.getHomeInfo()
  },
  onLoad: function () {
    //this.getHomeInfo()
  },
  getUserInfo: function (e) { }
})
