const QQMapWX = require('utils/qqmap-wx-jssdk.min.js')
//app.js
App({
  onLaunch: function () {

    wx.getSystemInfo({
      success: res => {
        const that = this
        //判断机型(适配iphoneX 以上刘海屏幕)
        const screenList = new Array("iPhone X", "iPhone 11", "iPhone12")
        const model = res.model
        for (let index = 0; index < screenList.length; index++) {
          if (model.search(screenList[index]) != -1) {
            that.globalData.isIPX = true
            break
          }
        }
      }
    })
  },
  beforeLogin() {
    const that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              let userInfo = res.userInfo
              wx.setStorageSync('userInfo', JSON.stringify(userInfo))
              that.login(userInfo)
            }
          })
        } else {
          wx.navigateTo({ url: '/pages/authorize/index' })
        }
      }
    })
  },
  login(userInfo) {
    console.log("login")
    wx.login({
      success: res => {
        this.httpPost(
          'wechat/login',
          { code: res.code, ...userInfo },
          true
        ).then(res => {
          wx.setStorageSync('token', res.data)

          //返回授权前页面
          let arrPages = getCurrentPages()

          if (arrPages.length > 1) {
            arrPages[arrPages.length - 2].setData({
              refresh: true
            })
            wx.navigateBack({
              delta: arrPages.length - (arrPages.length - 1),
              success: res => {
              },
              fail: function (res) { },
              complete: function (res) { }
            })
          } else {
            arrPages[arrPages.length - 1].setData({
              refresh: true
            })
            wx.startPullDownRefresh()
            wx.stopPullDownRefresh()
          }
        })
      }
    })
  },
  mapKey: 'DLVBZ-EMGWW-NEBRY-OZHQA-ZZNKZ-BFFIJ',
  //baseUrl: 'http://127.0.0.1:7000/merchant/main/api/v1/',
  baseUrl: 'http://127.0.0.1:9000/merchant/main/api/test/v1/',
  //baseUrl: 'https://main.ququgo.club/merchant/main/api/v1/',
  getLocationInfo: function () {//获取位置信息方法
    let _this = this
    const qqmapsdk = new QQMapWX({ key: _this.mapKey })
    let location = {}

    wx.getLocation({
      type: 'wgs84',
      success(res) {
        location.lat = res.latitude
        location.lon = res.longitude
        location.speed = res.speed
        location.accuracy = res.accuracy

        //通过腾讯地图接口获取详细信息
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: location.lat,
            longitude: location.lon
          },
          success: function (res) {
            location.city = res.result.ad_info.city
            location.province = res.result.ad_info.province
            location.info = res.result
            _this.globalData.location = location

            wx.setStorageSync('location', location)
          },
          fail: function (res) {
          },
          complete: function (res) {
          }
        })
      }
    })
  },
  httpBase: function (method, url, data, loading) {
    let _this = this
    let requestUrl = this.baseUrl + url
    let token = wx.getStorageSync('token')

    if (loading) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
    }

    function request(resolve, reject) {
      wx.request({
        header: {
          token: token
        },
        method: method,
        url: requestUrl,
        data: data,
        success: function (result) {
          if (loading) {
            wx.hideLoading()
          }
          var res = result.data

          if (res && res.code === 200) {
            resolve(res)
          } else if (res && res.code == 400) {
            if (res.message) {
              wx.showToast({
                title: res.message,
                icon: 'none'
              })
            }
            resolve(res)
          } else if (res && res.code == 401) {
            wx.removeStorageSync('token')
            _this.beforeLogin()
            resolve(res)
          } else if (res && res.code == 403) {
            wx.redirectTo({ url: '/pages/applyMerchant/index' })
            resolve(res)
          } else {
            reject(res)
          }
        },
        fail: function (res) {
          reject(res)
          if (loading) {
            wx.hideLoading()
          }
          wx.showToast({
            title: '网络出错',
            icon: 'none'
          })
        }
      })
    }

    return new Promise(request)
  },
  httpGet: function (url, data, loading) {
    return this.httpBase('GET', url, data, loading)
  },
  httpPost: function (url, data, loading) {
    return this.httpBase('POST', url, data, loading)
  },
  globalData: {
    version: '1.0.0',
    isIPX: false,
    location: {
      lat: 0,
      lon: 0,
      speed: 0,
      accuracy: 0,
      province: '',
      city: '',
      info: {}
    }//位置信息
  }
})
