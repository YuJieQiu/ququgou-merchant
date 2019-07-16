const app = getApp()
Page({
  data: {
    formats: {},
    bottom: 0,
    readOnly: false,
    placeholder: '开始输入...',
    _focus: false,
    initContents: {
      html: '',
      delta: {}
    }
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    wx.loadFontFace({
      family: 'Pacifico',
      source: 'url("https://sungd.github.io/Pacifico.ttf")',
      success: console.log
    })
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery()
      .select('#editor')
      .context(function(res) {
        that.editorCtx = res.context
        that.editorCtx.setContents(that.data.initContent)
      })
      .exec()
  },

  undo() {
    this.editorCtx.undo()
  },
  redo() {
    this.editorCtx.redo()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)
  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function() {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function(res) {
        console.log('clear success')
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() +
      1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
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
            that.editorCtx.insertImage({
              src: data.url,
              data: {
                id: data.id,
                role: 'god'
              },
              width: '364',
              success: function() {}
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
    // wx.chooseImage({
    //   count: 1,
    //   success: function() {
    //     that.editorCtx.insertImage({
    //       src:
    //         'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543767268337&di=5a3bbfaeb30149b2afd33a3c7aaa4ead&imgtype=0&src=http%3A%2F%2Fimg02.tooopen.com%2Fimages%2F20151031%2Ftooopen_sy_147004931368.jpg',
    //       data: {
    //         id: 'abcd',
    //         role: 'god'
    //       },
    //       success: function() {
    //         console.log('insert image success')
    //       }
    //     })
    //   }
    // })
  },
  onClickSave() {
    const that = this
    this.editorCtx.getContents({
      success: function(res) {
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]

        console.log(res)

        prevPage.saveContent(res.html)

        //选择按钮点击事件
        wx.navigateBack({
          delta: 2
        })
      }
    })
  },
  onLoad: function() {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let html = prevPage.data.productInfo.content
    this.setData({ 'initContent.html': html })
  }
})
