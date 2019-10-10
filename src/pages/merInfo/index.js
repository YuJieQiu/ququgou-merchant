const app = getApp()
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
const qqmapsdk = new QQMapWX({ key: app.mapKey })
const { strMapToObj } = require('../../utils/util.js')
import Toast from '../../components/vant-weapp/dist/toast/toast';
Page({
  data: {
    merInfo: {
      id: '',
      name: '',
      description: '',
      address: {
        city: '',
        region: '',
        town: '',
        address: '',
        latitude: 0,
        longitude: 0,
        name: '',
        remark: ''
      },
      businessTime: {
        startTime: '',
        endTime: ''
      },
      label: {},
      resources: [],
      phones: '', //多个, 间隔
      activeGoods: false,
      activeService: false,
      activeComment: false,
      logo: {},
      typeId: 0
    },
    images: [],
    region: [],
    selectAddress: {},
    businessStartTime: '06:00',
    businessEndTime: '21:00',
    saveButtonLoading: false
  },
  onChangeStartTime(e) {
    this.setData({
      'merInfo.businessTime.startTime': e.detail.value
    })
  },
  onChangeEndTime(e) {
    this.setData({
      'merInfo.businessTime.endTime': e.detail.value
    })
  },
  onChangeMerInfoAddress(e) {
    this.setData({
      'merInfo.address.address': e.detail
    })
  },
  onChangeMerInfoName(e) {
    this.setData({
      'merInfo.name': e.detail
    })
  },
  onChangeMerInfoPhone(e) {
    this.setData({
      'merInfo.phones': e.detail
    })
  },
  addressSelect(data) {
    this.setData({
      'merInfo.address': {
        city: data.ad_info.city,
        region: data.ad_info.province,
        town: data.ad_info.district,
        address: data.address,
        latitude: data.location.lat,
        longitude: data.location.lng,
        name: data.title,
        remark: ''
      }
    })
  },
  onAddressClick() {
    wx.navigateTo({
      url: '/pages/dotAdd/index'
    })
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail.value
    })
  },
  //图片上传
  merImageUpload() {
    var that = this
    let token = wx.getStorageSync('token')
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
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
            const data = JSON.parse(res.data).data
            var resources = that.data.merInfo.resources
            resources.push(...data)
            that.setData({
              'merInfo.resources': resources
            })
          },
          fail(err) {
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
    console.log(id)
    var resources = this.data.merInfo.resources
    resources.splice(resources.findIndex(item => item.id === id), 1)
    console.log(resources)
    that.setData({
      'merInfo.resources': resources
    })
    console.log(this.data.merInfo.resources)
  },
  //选择地区
  onChangeRegion(e) {
    console.log(e)
    if (e.detail.code.length != 3) {
      return
    }
    this.setData({ region: e.detail.value })
    console.log(this.data.region)
  },
  //保存更新数据
  saveSubmit() {
    var that = this
    that.setData({ 'saveButtonLoading': true })
    app.httpPost('mer/info/update', that.data.merInfo).then(res => {
      if (res.code == 200) {
        Toast.success('更新成功');
        that.getMerInfo()
      } else {
        Toast.fail('更新失败' + res.message);
      }
      that.setData({ 'saveButtonLoading': false })
    })

  },
  getMerInfo() {
    app
      .httpGet('get/mer/info', {})
      .then(res => {
        let data = res.data

        //label处理S
        let label = data.label
        let arrayLabel = []
        if (label != null) {
          const mapLabel = new Map(Object.entries(label))
          for (var [key, value] of mapLabel) {
            arrayLabel.push({ id: key, text: value })
          }
        }
        //label处理 E
        this.setData({
          merInfo: data,
          selectTabList: arrayLabel
        })
      })
  },

  onLoad: function () {
    this.getMerInfo()
  }
})
