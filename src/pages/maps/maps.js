const amap = require('../../utils/amap-wx.js')
const app = getApp()
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const qqmapsdk = new QQMapWX({ key: app.mapKey });
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    amapPlugin: null,
    lat: '',
    lng: '',
    covers: [],
    address: [],
    scrollH: 256
  },

  onLoad: function (options) {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将600rpx转换为px）
          scrollH: res.windowHeight - 44 - res.windowWidth / 750 * 600
        })
      }
    })
    this.setData({
      amapPlugin: new amap.AMapWX({
        key: this.data.key
      })
    })
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          lng: res.longitude,
          lat: res.latitude
        })
        that.getAddress(res.longitude, res.latitude)
        //that.getPoiAround("")
      }
    })

    //that.getPoiAround("")
    // setTimeout(() => {
    //   this.getLocation(() => {
    //     this.getPoiAround(options.key || "加油站")
    //   });
    // }, 200)
  },
  trim: function (value) {
    return value ? value.toString().replace(/(^\s*)|(\s*$)/g, "") : value;
  },
  showInput() {
    this.setData({
      inputShowed: true
    })
  },
  hideInput() {
    this.setData({
      inputVal: "",
      inputShowed: false
    })
    wx.hideKeyboard(); //强行隐藏键盘
  },
  clearInput() {
    this.setData({
      inputVal: ""
    })
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  getLocation(callback) {
    const that = this
    this.data.amapPlugin.getRegeo({
      success: (data) => {
        that.setData({
          lng: data[0].longitude,
          lat: data[0].latitude
        })
        callback();
      },
      fail: (info) => {
        callback();
      }
    })
  },
  getPoiAround(keywords) {
    //检索周边的POI	
    wx.showLoading({
      title: "加载中..."
    })
    const that = this;
    setTimeout(() => {
      let iconPath = '/assets/images/maps/location.png'

      qqmapsdk.search({
        keyword: keywords,
        location: that.data.lat + ',' + that.data.lng,
        page_size: 20,

        success: function (res) { //搜索成功后的回调
          let arr = [];
          let addr = [];
          console.log(res)
          if (res && res.status === 0) {
            if (res.data && res.data.length > 0) {
              let data = res.data
              for (let i = 0; i < data.length; i++) {
                arr.push({
                  id: i,
                  latitude: data[i].location.lat,
                  longitude: data[i].location.lng,
                  title: data[i].title,
                  iconPath: iconPath, //图标路径
                  width: 25,
                  height: 25,
                  zIndex: 0,
                  data: data[i]
                })
                addr.push({
                  id: i,
                  latitude: data[i].location.lat,
                  longitude: data[i].location.lng,
                  title: data[i].title,
                  address: data[i].address,
                  tel: '',
                  distance: data[i]._distance,
                  data: data[i]
                })
              }
              that.setData({
                address: addr,
                covers: arr
              })

              wx.hideLoading()
            } else {
              wx.showToast({
                title: '啥都没搜到,换个试试',
                icon: 'none'
              });
            }
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            });
          }
        },
        fail: function (res) {
          console.log(res);
        }
      });



      // this.data.amapPlugin.getPoiAround({
      //   querykeywords: keywords,
      //   location: '', //location： 经纬度坐标。 为空时， 基于当前位置进行地址解析。 格式： '经度,纬度'
      //   success: (data) => {
      //     console.log(data)
      //     let arr = [];
      //     let addr = [];
      //     for (let i = 0; i < data.markers.length; i++) {
      //       arr.push({
      //         id: i,
      //         latitude: data.markers[i].latitude,
      //         longitude: data.markers[i].longitude,
      //         title: data.markers[i].name
      //       })
      //       let tel = that.trim(data.poisData[i].tel);
      //       if (~tel.indexOf(";")) {
      //         tel = tel.split(";")[0]
      //       }
      //       addr.push({
      //         id: i,
      //         latitude: data.markers[i].latitude,
      //         longitude: data.markers[i].longitude,
      //         title: data.markers[i].name,
      //         address: data.markers[i].address,
      //         tel: tel,
      //         distance: data.poisData[i].distance
      //       })
      //     }
      //     that.setData({
      //       address: addr,
      //       covers: arr
      //     })

      //     wx.hideLoading()
      //   },
      //   fail: (info) => {
      //     console.log(info)
      //     wx.showToast({
      //       title: '获取位置信息失败，请检查是否打开位置权限'
      //     })
      //     wx.hideLoading()
      //   }
      // })

    }, 0);

  },
  bindInput: function (e) {
    const keywords = e.detail.value;
    this.getPoiAround(keywords);
  },
  marker: function (e) {
    const that = this
    const item = that.data.address[e.markerId || 0];
    const menu = ["选择"]

    wx.showActionSheet({
      itemList: menu,
      success(res) {
        let arrPages = getCurrentPages()
        let prevPage = arrPages[arrPages.length - 2]

        prevPage.addressSelect(item.data)
        //选择按钮点击事件
        wx.navigateBack({
          delta: arrPages.length - (arrPages.length - 1)
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })

  },
  call(event) {
    const index = Number(event.currentTarget.dataset.id);
    const tel = this.data.address[index].tel;
    if (tel) {
      wx.makePhoneCall({
        phoneNumber: tel
      })
    }

  },
  go(event) {
    const index = Number(event.currentTarget.dataset.id);
    const item = this.data.address[index];
    const latitude = Number(item.latitude)
    const longitude = Number(item.longitude)
    wx.openLocation({
      name: item.title,
      address: item.address,
      latitude,
      longitude,
      scale: 18
    })
  },
  select(event) {
    const index = Number(event.currentTarget.dataset.id);
    const item = this.data.address[index];
    console.log(item)
    let arrPages = getCurrentPages()
    let prevPage = arrPages[arrPages.length - 2]

    prevPage.addressSelect(item.data)
    //选择按钮点击事件
    wx.navigateBack({
      delta: arrPages.length - (arrPages.length - 1)
    })
  },
  customSelect(e) {
    const taht = this
    const menu = ["自定义地点选择"]

    wx.showActionSheet({
      itemList: menu,
      success(res) {
        taht.mapCtx = wx.createMapContext("maps");
        taht.mapCtx.getCenterLocation({
          type: 'gcj02',
          success: (res) => {
            qqmapsdk.reverseGeocoder({
              location: {
                latitude: res.latitude,
                longitude: res.longitude
              },
              success: (res) => {
                let arrPages = getCurrentPages()
                let prevPage = arrPages[arrPages.length - 2]

                prevPage.addressSelect(res.result)
                //选择按钮点击事件
                wx.navigateBack({
                  delta: arrPages.length - (arrPages.length - 1)
                })
              }
            })
          }
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  regionchange(e) {
    // 地图发生变化的时候，获取中间点，也就是cover-image指定的位置
    // if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
    //   this.setData({
    //     address: "正在获取地址..."
    //   })
    //   this.mapCtx = wx.createMapContext("maps");
    //   this.mapCtx.getCenterLocation({
    //     type: 'gcj02',
    //     success: (res) => {
    //       //console.log(res)
    //       // this.setData({
    //       //   latitude: res.latitude,
    //       //   longitude: res.longitude
    //       // })
    //       this.getAddress(res.longitude, res.latitude);
    //     }
    //   })
    // }
  },
  getAddress: function (lng, lat) {
    const that = this
    let iconPath = '/assets/images/maps/location.png'
    //根据经纬度获取地址信息
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success: (res) => {
        console.log(res)
        let data = res.result
        let arr = []
        let addr = []
        arr.push({
          id: 0,
          latitude: data.location.lat,
          longitude: data.location.lng,
          title: data.address,
          iconPath: iconPath, //图标路径
          width: 25,
          height: 25,
          data: data
        })
        addr.push({
          id: 0,
          latitude: data.location.lat,
          longitude: data.location.lng,
          title: data.address,
          address: data.address,
          tel: '',
          distance: 0,
          data: data
        })
        that.setData({
          address: addr,
          covers: arr
        })
      },
      fail: (res) => {
        this.setData({
          address: "获取位置信息失败"
        })
      }
    })
  },
})