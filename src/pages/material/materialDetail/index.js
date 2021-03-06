const app = getApp()
const { appUtils, appValidate } = require('../../../utils/util.js')
const pageStart = 1
Page({
  data: {
    list: [],
    page: 1, //默认第一页开始
    limit: 10, //默认每页10条
    all: true,
    status: 0,
    pageEnd: false,
    active: 0,
    tabIndex: 0,
    tabsList: [],
    text: "",
    url: ""
  },
  onCancel() {
    wx.switchTab({
      url: "/pages/home/index"
    })
  },
  onChange(e) {
    this.setData({ text: e.detail })
  },
  previewImage(e) {
    let img = e.currentTarget.dataset.img;
    let imgs = []
    this.data.list.forEach(element => {
      imgs.push(element.img)
    });
    wx.previewImage({
      current: img,
      urls: imgs
    })
  },
  onSearch: function () {
    const that = this
    let data = {
      url: this.data.url,
      type: parseInt(1)
    }
    app.httpGet('product/material/search', data).then(res => {
      console.log(res)
      wx.stopPullDownRefresh()
      // if (res.data == null || res.data.length <= 0) {
      //   that.setData({ pageEnd: true })
      //   return
      // }
      let list = res.data//.list
      // if (that.data.page > 1) {
      //   list.push(...res.data)
      // } else {
      //   list = res.data
      // }
      // if (res.data.length < 10) {
      //   that.setData({ pageEnd: true })
      // }
      that.setData({
        list: list
      })
    })
  },
  // onScrollTab(e){
  //     console.log(e)
  // },
  // onPageScroll(e){ // 获取滚动条当前位置
  //     console.log(e)
  //     //console.log(e.scrollTop)//获取滚动条当前位置的值
  // },
  //上拉刷新
  onPullDownRefresh() {
    this.setData({ page: 1, pageEnd: false, list: [] })
    this.getOrderListInfo()
  },
  onReachBottom() {
    // if (!this.data.pageEnd) {
    //   this.setData({ page: this.data.page + 1 })
    //   console.log('onReachBottom')
    //   this.getOrderListInfo()
    // }
    // Do something when page reach bottom.
  },
  onInputRemark(e) {
    this.setData({ remark: e.detail })
  },
  //跳转到详情页面
  onClickRedirectionDetail(e) {
    let that = this
    let no = e.currentTarget.dataset.no
    wx.navigateTo({ url: '/pages/orderDetail/index?orderNo=' + no })
  },
  onShow: function () { },
  onLoad(options) {
    console.log(options)
    let url = options.url
    if (url == null || url == '') {
      return
    }
    this.setData({ url: url })
    this.onSearch()
  }
})
