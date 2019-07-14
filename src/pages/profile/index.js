//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    name: "zhangsan",
    avatar: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJl50icAN1r7C1vjquqoRTgnRiaVH8tPpibE0f0l2LR8ZjePcwPLcNW4mNhuJArmG2pC6MrJyF50FrQA/132"
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  onLoad: function () {

  },
  getUserInfo: function (e) {

  }
})
