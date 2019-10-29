var app = getApp();
import Toast from '../../../components/vant-weapp/dist/toast/toast';
Page({
  data: {
    list: []
  },
  getDataInfo() {
    const that = this
    app.httpGet('banner/get', {}).then(res => {
      wx.stopPullDownRefresh()
      if (res.data != null && res.data.length > 0) {
        that.setData({
          list: res.data
        })
      }
    })
  },
  onChangeText(e) {
    var that = this
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const field = e.currentTarget.dataset.field
    const type = e.currentTarget.dataset.type
    var text = e.detail
    let changefield = `list[${index}].${field}`

    if (type == 'int') {
      text = parseInt(text)
    }
    this.setData({
      [changefield]: text
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
            const resources = JSON.parse(res.data).data[0]
            //var resources = that.data.list 
            //resources.push(...data)
            console.log(resources)
            let list = that.data.list
            list.push({
              description: "",
              id: 0,
              images:
              {
                url: resources.url
              },
              linkUrl: "",
              name: "",
              position: "",
              backgroundColor: "#fd9802",
              fontColor: "#fff",
              resourceId: resources.id,
              sort: list.length + 1,
              type: "1"
            })
            that.setData({
              'list': list
            })
            console.log(list)
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
    app.httpPost('banner/save', { banners: that.data.list }, true).then(res => {
      that.setData({ 'saveButtonLoading': false })
      if (res.code == 200) {
        Toast.success('更新成功');
        that.getDataInfo()
      } else {
        Toast.fail('更新失败' + res.message);
      }
    })

  },
  onLoad() {
    this.getDataInfo()
  }
})