const app = getApp()
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
const qqmapsdk = new QQMapWX({ key: app.mapKey })
const { $Toast } = require('../../components/iview-weapp/dist/base/index')
const { strMapToObj } = require('../../utils/util.js')
Page({
  data: {
    merInfo: {
      id: 'd72fc8d4089344c28cd4c66acbeb307f',
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
    show: true,
    username: '',
    password: '',
    selectTabList: [],
    tabData: {
      tagList: [],
      // tagHotList: [
      //   '标签热门1',
      //   '标签热门2',
      //   '标签热门3',
      //   '标签热门4',
      //   '标签热门5',
      //   '标签热门6'
      // ],
      tabNewStr: '',
      hideSelect: false,
      hideNew: true,
      hideTot: false,
      show: false
    }
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
    console.log(this.data.merInfo.name)
  },
  onChangeMerInfoPhone(e) {
    this.setData({
      'merInfo.phones': e.detail
    })
  },
  addressSelect(data) {
    console.log(data)
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
    console.log(this.data.merInfo.address)
  },
  onAddressClick() {
    wx.navigateTo({
      url: '/pages/dotAdd/index'
    })
    // 腾讯地图接口调用
    // qqmapsdk.search({
    //   keyword: '酒店',
    //   success: function(res) {
    //     console.log(res)
    //   },
    //   fail: function(res) {
    //     console.log(res)
    //   },
    //   complete: function(res) {
    //     console.log(res)
    //   }
    // })
    // wx.getLocation({
    //   type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
    //   success(res) {
    //     console.log(res)
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     const speed = res.speed
    //     const accuracy = res.accuracy

    //     qqmapsdk.reverseGeocoder({
    //       location: {
    //         latitude: latitude,
    //         longitude: longitude
    //       },
    //       success: function(res) {
    //         let province = res.result.ad_info.province
    //         let city = res.result.ad_info.city
    //         console.log(JSON.stringify(res))
    //         console.log(JSON.stringify(city))
    //         console.log(JSON.stringify(province))
    //       },
    //       fail: function(res) {
    //         console.log(res)
    //       },
    //       complete: function(res) {
    //         // console.log(res);
    //       }
    //     })

    // wx.openLocation({
    //   latitude,
    //   longitude,
    //   scale: 18
    // })
    //   }
    // })
  },
  onClose(event) {
    if (event.detail === 'confirm') {
      // 异步关闭弹窗
      setTimeout(() => {
        this.setData({
          show: false
        })
      }, 1000)
    } else {
      this.setData({
        show: false
      })
    }
  },
  //获取标签列表
  getTagList() {
    var that = this
    app.httpGet('label/get/list', {}).then(res => {
      let data = res.data
      console.log(res.data)
      that.setData({
        'tabData.tagList': data
      })
    })
  },
  //创建标签
  onTagSearch(e) {
    var that = this
    if (e.detail == '') {
      this.setData({
        'tabData.tabNewStr': '',
        'tabData.hideNew': true,
        'tabData.hideSelect': false,
        'tabData.hideTot': false
      })
    } else {
      that.setData({
        'tabData.tabNewStr': e.detail,
        'tabData.hideNew': false,
        'tabData.hideSelect': true,
        'tabData.hideTot': true
      })
    }
  },
  onClickPopupTagClose() {
    this.setData({
      'tabData.show': false
    })
  },
  //确定
  onClickPopupTagOk() {
    var that = this
    let label = new Map() //this.data.merInfo.label
    that.data.selectTabList
    that.data.selectTabList.forEach(element => {
      label.set(element.id, element.text)
    })
    console.log(this.data.merInfo.label)
    this.setData({
      'merInfo.label': strMapToObj(label),
      'tabData.show': false,
      selectTabList: []
    })
  },
  //删除
  onClickDeleteTag(e) {
    let value = e.currentTarget.dataset.value
    let id = e.currentTarget.dataset.id
    let list = this.data.selectTabList
    let newList = list.filter(item => item.id !== id)
    this.setData({
      selectTabList: newList
    })
  },
  //选择
  onClickHotTag(e) {
    let text = e.currentTarget.dataset.text
    let id = e.currentTarget.dataset.id
    let list = this.data.selectTabList

    console.log(list)
    list.push({ id: id, text: text })
    this.setData({
      selectTabList: list
    })
  },
  //创建
  onClickCreateTag(e) {
    console.log(e)
    var that = this
    let list = this.data.tabData.tagList
    let selectList = this.data.selectTabList
    //创建标签
    app
      .httpPost('label/create', {
        text: that.data.tabData.tabNewStr,
        sort: that.data.tabData.tagList.length + 1
      })
      .then(res => {
        let data = res.data
        console.log(res.data)
        list.push({
          id: data.id,
          text: data.text
        })
        selectList.push({
          id: data.id,
          text: data.text
        })

        this.setData({
          'tabData.tabNewStr': '',
          'tabData.hideNew': true,
          'tabData.hideSelect': false,
          'tabData.hideTot': false,
          'tabData.tagList': list,
          selectTabList: selectList
        })
      })

    //console.log(this.data.tabData)
  },
  //选择
  onClickSelectTag() {
    this.setData({
      'tabData.show': true
    })
    //'tabData.tagList': this.data.tabList
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
            $Toast({
              content: '上传失败' + err,
              type: 'error'
            })
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
    app.httpPost('mer/info/update', that.data.merInfo).then(res => {
      let data = res.data
      console.log(res)
    })
  },
  onLoad: function() {
    app
      .httpGet('get/mer/info', { id: '6de79d7d7f764e3981b35d8b9a36fcc3' })
      .then(res => {
        console.log(res.data)
        this.setData({
          merInfo: res.data
        })
      })

    this.getTagList()

    // wx.request({
    //     url:"http://127.0.0.1:7080/api/v1/get/mer/info",
    //     data:{id:"d72fc8d4089344c28cd4c66acbeb307f"},
    //     header:{
    //         "Content-Type":"application/json"
    //     },
    //     success:function(res){
    //         console.log(res.data)
    //     },
    //     fail:function(err){
    //         console.log(err)
    //     }

    // })
  },
  getUserInfo: function(e) {}
})
