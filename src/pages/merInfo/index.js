const app = getApp()
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const qqmapsdk = new QQMapWX({ key: app.mapKey });
Page({
  data: {
    region: [],
  },
  onAddressClick(){
    wx.getLocation({
        type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
        success(res) {
          const latitude = res.latitude
          const longitude = res.longitude
          wx.openLocation({
            latitude,
            longitude,
            scale: 18
          })
        }
      })
 },
  onLoad: function () {
     
  },
  getUserInfo: function(e) {
    
  }
})
