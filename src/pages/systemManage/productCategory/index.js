var app = getApp();
import Toast from '../../../components/vant-weapp/dist/toast/toast';
Page({
  data: {
    list: [],
    activeNames: ['1'],
    actions: [
      {
        name: '删除',
        color: '#fff',
        fontsize: '20',
        width: 100,
        background: '#ed3f14'
      }
    ]
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    })
  },
  addItem(e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    var list = this.data.list
    console.log(e)
    if (id > 0) {
      list.forEach(element => {
        if (element.id == id) {
          element.child.push({
            id: 0,
            name: "分类",
            pid: id
          })
        }
      });
    } else if (index > 0) {
      list[index].child.push({
        id: 0,
        name: "分类"
      })
    } else {
      list.push({
        id: 0,
        name: "分类",
        child: []
      })
    }
    this.setData({
      list: list
    })
  },
  deleteItem(e) {
    const id = e.currentTarget.dataset.id
    const item = e.currentTarget.dataset.item
    const index = e.currentTarget.dataset.index

    var list = this.data.list
    if (item.pid > 0) {
      list.forEach(element => {
        if (element.id == item.pid) {
          element.child.splice(index, 1)
        }
      });
    } else {

      list.splice(index, 1)
    }
    this.setData({
      list: list
    })
  },
  //图片上传
  onImageUpload(e) {
    const callback = e.currentTarget.dataset.callback
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
            that.skuImagesLoad(data, e)
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
  skuImagesLoad: function (data, e) {
    const id = e.currentTarget.dataset.id
    const item = e.currentTarget.dataset.item
    const index = e.currentTarget.dataset.index

    var list = this.data.list
    if (item.pid > 0) {
      list.forEach(element => {
        if (element.id == item.pid) {
          element.child[index].images = { url: data.url }
          element.child[index].resourceId = data.id
        }
      });
    } else {
      list[index].images = { url: data.url }
      list[index].resourceId = data.id
    }
    this.setData({
      list: list
    })
  },
  skuImagesDelete(e) {
    const id = e.currentTarget.dataset.id
    const item = e.currentTarget.dataset.item
    const index = e.currentTarget.dataset.index

    var list = this.data.list
    if (item.pid > 0) {
      list.forEach(element => {
        if (element.id == item.pid) {
          element.child[index].images = {}
          element.child[index].resourceId = 0
        }
      });
    } else {
      list[index].images = {}
      list[index].resourceId = 0
    }
    this.setData({
      list: list
    })
  },
  getDataInfo() {
    const that = this
    app.httpGet('product/category/get', {}).then(res => {
      wx.stopPullDownRefresh()
      console.log(res)
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
              resourceId: resources.id,
              sort: 0,
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
    app.httpPost('product/category/save', { categoryList: that.data.list }).then(res => {
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