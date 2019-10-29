const app = getApp()
const { appUtils, appValidate } = require('../../utils/util.js')
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
    orderNo: ""
  },

  onShow: function () { },
  onCancel() {
    wx.switchTab({
      url: "/pages/home/index"
    })
  },
  onSearch: function () {
    const that = this
    let data = {
      page: this.data.page,
      limit: this.data.limit,
      all: true,
      orderNo: this.data.orderNo
    }

    app.httpGet('order/get/list', data).then(res => {
      wx.stopPullDownRefresh()
      if (res.data == null || res.data.length <= 0) {
        that.setData({ pageEnd: true })
        return
      }

      let list = that.data.list
      if (that.data.page > 1) {
        list.push(...res.data)
      } else {
        list = res.data
      }
      if (res.data.length < 10) {
        that.setData({ pageEnd: true })
      }
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
    if (!this.data.pageEnd) {
      this.setData({ page: this.data.page + 1 })
      console.log('onReachBottom')
      this.getOrderListInfo()
    }
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
  onLoad(options) {
    const that = this

  }
})
