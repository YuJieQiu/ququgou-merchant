const app = getApp()
import Dialog from '../../components/vant-weapp/dist/dialog/dialog'
Page({
  data: {
    orderNo: '',
    order: {},
    address: {},
    products: []
  },

  onShow: function () { },
  getDataInfo: function (orderNo) {
    app.httpGet('order/get/detail', { orderNo: orderNo }).then(res => {
      console.log(res)
      this.setData({
        address: res.data.address,
        products: res.data.products,
        order: res.data
      })
    })
  },
  onOrderCancel() {
    let that = this
    Dialog.confirm({
      title: '取消订单',
      message: '是否取消订单'
    })
      .then(() => {
        app
          .httpPost('order/cancel', { orderNo: that.data.orderNo })
          .then(res => {
            console.log(res)
          })
      })
      .catch(() => { })
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
