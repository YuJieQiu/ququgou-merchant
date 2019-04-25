//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    activeNames: ['1']
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  onLoad: function () {
     
  },
  getUserInfo: function(e) {
    
  }
})
