const app = getApp()

Page({
  data: {
    active: 1,
    list: [],
    page: 1, //默认第一页开始
    limit: 10, //默认每页10条
    all: true,
    status: 0,
    pageEnd: false
  },
  getProductList: function() {
    let data = {
      page: this.data.page,
      limit: this.data.limit,
      all: this.data.all,
      status: this.data.status
    }
    app.httpGet('product/get/list', data).then(res => {
      wx.stopPullDownRefresh()
      if (res.data.length <= 0) {
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
  //
  updateProductStatus() {},
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
  onLoad: function() {
    this.getProductList()
  }
})
