const app = getApp()

Page({
  data: {
    url: ''
  },
  onLoad: function (options) {
    console.log(options.url);
    options.url ? this.setData({ url: options.url }) : wx.navigateBack({ delta: 2 }); 
  }
})
