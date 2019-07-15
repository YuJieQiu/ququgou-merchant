const app = getApp()
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
const mapInstance = new QQMapWX({ key: app.mapKey })

let mapContext = null

Page({
  data: {
    isIphoneX: app.globalData.isIphoneX, // iphoneX适配
    mapKey: app.mapKey, // 地图key
    city: '', // 当前城市
    keyword: '', // 搜索框中的值
    markers: [], // 点位信息
    dotList: [], // 当前搜索点列表
    dotData: null, // 当前选择点
    centerDot: null, // 中心点信息
    title: ':', // 当前选择点信息
    address: ':', // 当前选择点地址
    latitude: '', // 当前中心点纬度
    longitude: '', // 当前中心点经度
    scale: 18 // 地图缩放级别
  },
  regionChange: function(e) {
    let _this = this
    mapContext.getCenterLocation({
      success(res) {
        _this.setData({
          centerDot: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
      }
    })
  },
  bindInput: function() {
    // 搜索栏事件
    let url = './search'
    if (this.data.city) {
      url = url + '?city=' + this.data.city
    }
    wx.navigateTo({
      url: url
    })
  },
  chooseCenter() {
    // 中心点点击事件
    let centerDot = this.data.centerDot
    if (centerDot && centerDot.latitude && centerDot.longitude) {
      wx.navigateTo({
        url: 'select?type=center'
      })
    } else {
      wx.showToast({
        title: '点位信息有误,请重新选择',
        icon: 'none'
      })
    }
  },
  chooseDot() {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    //console.log(pages)
    //console.log(prevPage)
    //console.log(this.data.dotData)

    prevPage.addressSelect(this.data.dotData)
    //选择按钮点击事件
    if (this.data.dotData && this.data.dotData.id) {
      wx.navigateBack({
        delta: 2
      })
    } else {
      wx.showToast({
        title: '点位信息有误,请重新选择',
        icon: 'none'
      })
    }
  },
  makerTap: function(e) {
    // 地图上markers点击事件
    let id = e.markerId
    let dotData = (this.data.dotList || []).find(item => {
      return item.id === id
    })
    if (dotData) {
      this.generateMarkers(this.data.dotList, dotData.id)
    }
  },
  generateMarkers(data, id) {
    // 生成地图上markers数据
    let markers = []
    let dotData = data[0]
    for (let i = 0, len = data.length; i < len; i++) {
      let iconPath = '/assets/images/marker.png'
      let zIndex = 0

      if (data[i].id === id) {
        iconPath = '/assets/images/marker_checked.png'
        zIndex = 1
        dotData = data[i]
      }
      markers.push({
        // 获取返回结果，放到mks数组中
        id: data[i].id,
        latitude: data[i].location.lat,
        longitude: data[i].location.lng,
        iconPath: iconPath, //图标路径
        zIndex: zIndex,
        width: 40,
        height: 40
      })
    }
    this.setData({
      //设置markers属性，将搜索结果显示在地图中
      markers: markers,
      dotList: data,
      dotData: dotData,
      title: dotData.title,
      address: dotData.address
    })
  },
  onLoad() {
    mapContext = wx.createMapContext('map')

    let _this = this
    wx.getLocation({
      type: 'gcj02',
      success: response => {
        this.setData({
          latitude: response.latitude,
          longitude: response.longitude,
          scale: 18
        })
        mapInstance.reverseGeocoder({
          location: {
            latitude: response.latitude,
            longitude: response.longitude
          },
          get_poi: 1,
          success: function(res) {
            if (res && res.status === 0) {
              if (res.result) {
                if (res.result.pois && res.result.pois.length > 0) {
                  _this.generateMarkers(res.result.pois, res.result.pois[0].id)
                }
                if (
                  res.result.address_component &&
                  res.result.address_component.city
                ) {
                  _this.setData({
                    city: res.result.address_component.city
                  })
                }
              }
            } else {
              wx.showToast({
                title: res.message,
                icon: 'none'
              })
            }
          },
          fail: function(res) {
            console.log(res)
          }
        })
      }
    })
  }
})
