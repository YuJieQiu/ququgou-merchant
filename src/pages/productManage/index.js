const app = getApp()

Page({
  data: {
    active: 0,
    list: [],
    page: 1, //默认第一页开始
    limit: 10, //默认每页10条
    all: true,
    status: 0,
    pageEnd: false
  },
  getProductList: function () {
    let data = {
      page: this.data.page,
      limit: this.data.limit,
      all: this.data.all,
      status: this.data.status
    }
    app.httpGet('product/get/list', data).then(res => {
      wx.stopPullDownRefresh()
      if (res.data == null || res.data.length <= 0) {
        this.setData({ pageEnd: true })
        return
      }
      for (let index = 0; index < res.data.length; index++) {
        let element = res.data[index].createdTime
        res.data[index].createdTime = element.substring(0, 10)
      }
      let list = this.data.list
      if (this.data.page > 1) {
        list.push(...res.data)
      } else {
        list = res.data
      }

      this.setData({
        list: list
      })
    })
  },
  //更新状态
  updateProductStatus(e) {
    const that = this
    let id = e.currentTarget.dataset.id
    let updateStatus = e.currentTarget.dataset.upstatus
    let data = {
      productId: id,
      status: parseInt(updateStatus)
    }

    app.httpPost("product/update/status", data).then(res => {
      let data = res.data
      console.log(data)
      that.setData({ page: 1, pageEnd: false, list: [] })
      that.getProductList()
    })
  },
  onClickProduct(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/productEdit/index?id=' + id
    })
  },
  //系统函数
  //上拉刷新
  onPullDownRefresh() {
    this.setData({ page: 1, pageEnd: false, list: [] })
    this.getProductList()
  },
  //系统函数
  //到达页面底端的时候
  onReachBottom() {
    if (!this.data.pageEnd) {
      this.setData({ page: this.data.page + 1 })
      this.getProductList()
    }
    //console.log('onReachBottom')
    // Do something when page reach bottom.
  },
  onChangeTabs(e) {
    const name = e.detail.name
    if (name == 1) {
      this.setData({ status: 1 })
    } else if (name == 2) {
      this.setData({ status: -1 })
    } else {
      this.setData({ status: 0 })
    }
    this.setData({ page: 1, pageEnd: false, list: [] })
    this.getProductList()
  },
  onLoad: function () {
    this.getProductList()
  }
})
