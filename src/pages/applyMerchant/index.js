const app = getApp()
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
const qqmapsdk = new QQMapWX({ key: app.mapKey })
const { strMapToObj } = require('../../utils/util.js')
import Toast from '../../components/vant-weapp/dist/toast/toast';
Page({
  data: {
    applyData: {
      id: 0,
      name: "",
      description: "",
      phone: "",
      typeId: 0,
      city: "",
      region: "",
      town: "",
      address: "",
      latitude: 0,
      longitude: 0,
      resourcesIds: [],
      remark: "",
      resources: [],
      status: 0,
      statusText: ""
    },
    address: {},
    dotData: {},
    selectAddress: {},
    images: [],
    region: [],
  },
  onAddressClick() {
    wx.navigateTo({
      url: '/pages/dotAdd/index'
    })
  },
  //地址选择回调
  addressSelect(data) {
    this.setData({
      'applyData.city': data.ad_info.city,
      'applyData.region': data.ad_info.province,
      'applyData.town': data.ad_info.district,
      'applyData.address': data.address,
      'applyData.latitude': data.location.lat,
      'applyData.longitude': data.location.lng,
    })
  },
  //图片上传
  merImageUpload() {
    var that = this
    let token = wx.getStorageSync('token')

    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '上传中...',
          mask: true
        })
        wx.uploadFile({
          url: app.baseUrl + 'file/uploadFiles', //上传图片接口
          filePath: tempFilePaths[0],
          method: 'POST',
          name: 'file',
          header: {
            token: token
          },
          formData: {},
          success(res) {
            wx.hideLoading()
            const data = JSON.parse(res.data).data
            var resources = that.data.applyData.resources
            resources.push(...data)
            that.setData({
              'applyData.resources': resources
            })
          },
          fail(err) {
            wx.hideLoading()
            Toast.fail('上传失败' + err);
          }
        })
      }
    })
  },
  //删除图片
  deleteImage(event) {
    var that = this
    const id = event.currentTarget.dataset.id
    var resources = this.data.applyData.resources
    resources.splice(resources.findIndex(item => item.id === id), 1)
    that.setData({
      'applyData.resources': resources
    })
  },
  //选择地区
  onChangeRegion(e) {
    if (e.detail.code.length != 3) {
      return
    }
    this.setData({ region: e.detail.value })
  },
  onChangeMerInfoRemark(e) {
    this.setData({
      'applyData.remark': e.detail
    })
  },
  onChangeMerInfoAddress(e) {
    this.setData({
      'applyData.address': e.detail
    })
  },
  onChangeMerInfoName(e) {
    this.setData({
      'applyData.name': e.detail
    })
  },
  onChangeMerInfoPhone(e) {
    this.setData({
      'applyData.phone': e.detail
    })
  },
  //保存更新数据
  saveSubmit() {
    var that = this

    app.httpPost('mer/apply/create', that.data.applyData, true).then(res => {

      if (res.code == 200) {
        Toast.success('已提交');
        // that.getMerInfo()
      } else {
        Toast.fail('提交失败' + res.message);
      }
      that.getApplyInfo()
    })
  },
  //自助通过审核
  autorApplySubmit() {
    var that = this
    app.httpPost('mer/apply/auto/verified', { id: that.data.applyData.id }, true).then(res => {
      if (res.code == 200) {
        Toast.success('成功');
        wx.switchTab({ url: '/pages/home/index' })
        // that.getMerInfo()
      } else {
        Toast.fail('失败' + res.message);
      }
    })
  },
  //查询申请信息
  getApplyInfo() {
    const that = this
    app.httpGet('mer/apply', {}).then(res => {
      if (res.code == 200 && res.data != null && res.data.id > 0) {
        that.setData({
          'applyData': res.data
        })
      }
    })
  },
  onLoad() {
    this.getApplyInfo()
  }
})