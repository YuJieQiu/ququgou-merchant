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
  getUserInfo: function (e) { },
  //扫一扫
  onClickScan(e) {
    //允许从相机和相册扫码
    wx.scanCode({
      success(res) {
        if (res != null && res.result != null) {
          let data = JSON.parse(res.result)
          if (data.type == "order") {
            wx.navigateTo({ url: '/pages/orderDetail/index?orderNo=' + data.code })
          }
        }
      }
    })

  }
})
