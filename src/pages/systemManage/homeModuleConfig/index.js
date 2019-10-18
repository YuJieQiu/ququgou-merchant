var app = getApp();
import Toast from '../../../components/vant-weapp/dist/toast/toast';
Page({
  data: {
    list: [],
    type: 'home_category'
  },
  getDataInfo() {
    const that = this
    app.httpGet('app/module/get', { type: that.data.type }).then(res => {
      wx.stopPullDownRefresh()
      console.log(res)
      if (res.data != null && res.data.length > 0) {
        that.setData({
          list: res.data
        })
      }
    })
  },
  onChangeField(e) {
    var that = this
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const field = e.currentTarget.dataset.field
    let list = that.data.list
    list[index][field] = e.detail
    // list.forEach(element => {
    //   if (element.id == id) {
    //     element[field] = e.detail
    //   }
    // });
    this.setData({
      'list': list
    })
  },
  onChangeFieldInt(e) {
    var that = this
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const field = e.currentTarget.dataset.field
    let list = that.data.list
    list[index][field] = parseInt(e.detail)

    this.setData({
      'list': list
    })
  },
  onChangeText(e) {
    var that = this
    const id = e.currentTarget.dataset.id
    var resources = that.data.list
    resources.forEach(currentItem => {
      if (currentItem.id == id) {
        currentItem.linkUrl = e.detail
      }
    })
    this.setData({
      'list': resources
    })
  },
  merImagesLoad: function (data, index) {
    const that = this
    let list = that.data.list
    list.push({
      id: 0,
      images:
      {
        url: data.url
      },
      sort: list.length + 1,
      resourceId: data.id
    })
    that.setData({
      'list': list
    })
    console.log(list)
  },
  //图片上传
  onImageUpload(e) {
    const callback = e.currentTarget.dataset.callback
    const index = e.currentTarget.dataset.index
    const that = this
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
            const data = JSON.parse(res.data).data[0]
            that.merImagesLoad(data, index)

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
    var resources = this.data.list
    resources.splice(resources.findIndex(item => item.id === id), 1)
    that.setData({
      'list': resources
    })
  },
  //保存更新数据
  saveSubmit() {
    var that = this
    that.setData({ 'saveButtonLoading': true })
    app.httpPost('app/module/save', { appConfigs: that.data.list, type: that.data.type }).then(res => {
      that.setData({ 'saveButtonLoading': false })
      if (res.code == 200) {
        Toast.success('更新成功');
        that.getDataInfo()
      } else {
        Toast.fail('更新失败' + res.message);
      }
    })

  },
  onLoad(options) {
    if (options.type == null || options.type == '') {
      this.setData({
        type: "home_category"
      })
    } else {
      this.setData({
        type: options.type
      })
    }

    console.log(options)
    if (options.title == null || options.title == '') {
      wx.setNavigationBarTitle({
        title: "分类设置"
      })
    } else {
      wx.setNavigationBarTitle({
        title: options.title
      })
    }


    this.getDataInfo()
  }
})