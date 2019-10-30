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
  onAddressClick(e) {
    const latitude = e.currentTarget.dataset.latitude
    const longitude = e.currentTarget.dataset.longitude
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },
  onPhoneClick(e) {
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
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
      wx.stopPullDownRefresh()
      this.setData({
        userInfo: res.data
      })
    })
  },
  //订单确认完成
  onOrderSuccess(e) {
    const that = this
    Dialog.confirm({
      title: '确认完成',
      message: '是否完成订单'
    }).then(() => {
      app.httpPost('order/user/success', { orderNo: that.data.order.no }).then(res => {
        if (res.code == '200') {
          wx.startPullDownRefresh()
          wx.stopPullDownRefresh()
          let arrPages = getCurrentPages()
          if (arrPages.length > 1) {
            arrPages[arrPages.length - 2].setData({
              refresh: true
            })
          }
        }
      })
    }).catch(() => {
      // on cancel
    });
  },
  //上拉刷新
  onPullDownRefresh() {
    this.getDataInfo(this.data.orderNo)
  },
  onLoad(options) {
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
