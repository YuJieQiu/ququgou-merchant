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
    tabsList: [
    ]
  },

  onShow: function () { },
  getOrderListInfo: function () {
    const that = this
    let data = {
      page: this.data.page,
      limit: this.data.limit,
      all: this.data.all,
      status: this.data.status
    }

    app.httpGet('order/get/list', data).then(res => {
      wx.stopPullDownRefresh()
      if (res.data.length <= 0) {
        that.setData({ pageEnd: true })
        return
      }

      let list = that.data.list
      if (that.data.page > 1) {
        list.push(...res.data)
      } else {
        list = res.data
      }

      that.setData({
        list: list
      })
    })
  },
  onClickTab(e) {
    let data = e.detail
    switch (parseInt(data.name)) {
      case 0: //全部
        this.setData({ all: true, list: [], page: 1, pageEnd: false })
        break
      case 1://待处理
        this.setData({
          all: false,
          status: "0001",
          list: [],
          page: 1,
          pageEnd: false
        })
        break
      case 2://已取消
        this.setData({
          all: false,
          status: "-1000",
          list: [],
          page: 1,
          pageEnd: false
        })
        break
      case 3://已完成
        this.setData({
          all: false,
          status: "9990",
          list: [],
          page: 1,
          pageEnd: false
        })
        break
    }
    this.getOrderListInfo()
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
    const tab = [
      {
        title: "全部",
        name: 0,
        statusText: ""
      },
      {
        title: "待处理",
        name: 1,
        statusText: "待处理"
      },
      {
        title: "已取消",
        name: 2,
        statusText: "已取消"
      },
      {
        title: "已完成",
        name: 3,
        statusText: "已完成"
      }]

    if (typeof (options.active) != "undefined") {
      this.setData({ tabsList: tab, active: parseInt(options.active) })
    } else {
      this.setData({ tabsList: tab, active: 0 })
    }

    this.onClickTab({
      detail: {
        name: that.data.active
      }
    })
  }
})
