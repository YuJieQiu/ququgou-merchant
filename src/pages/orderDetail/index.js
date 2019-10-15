const app = getApp()
import Dialog from '../../components/vant-weapp/dist/dialog/dialog'
Page({
  data: {
    orderNo: '',
    order: {},
    address: {},
    products: [],
    userInfo: {}
  },

  onShow: function () { },
  getDataInfo: function (orderNo) {
    app.httpGet('order/get/detail', { orderNo: orderNo }).then(res => {

      this.setData({
        address: res.data.address,
        products: res.data.products,
        order: res.data
      })
      this.getOrderUserInfo()
    })
  },
  getOrderUserInfo: function () {
    app.httpGet('order/get/user/info', { orderNo: this.data.order.no }).then(res => {
      this.setData({
        userInfo: res.data
      })
    })
  },
  onLoad(options) {
    console.log(options.orderNo)
    let orderNo = options.orderNo
    if (orderNo == null || orderNo == '') {
      wx.redirectTo({ url: '/pages/orderList/index' })
    }

    this.setData({
      orderNo: orderNo
    })
    this.getDataInfo(orderNo)
  }
})
