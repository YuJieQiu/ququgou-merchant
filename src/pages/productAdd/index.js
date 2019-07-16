const app = getApp()

Page({
  data: {
    readOnly: false,
    productInfo: {
      brand_id: 0,
      category_ids: [],
      name: '',
      type_id: 0,
      status: 0,
      content: '<h1>123212113adsf</h1>',
      content_remark: '',
      description: '',
      keywords: '',
      tags: {
        tag_id: 0,
        name: ''
      },
      original_price: '', //原始价格 (下划线价格) 展示使用
      min_price: '',
      max_price: '',
      current_price: '',
      sales: 0,
      product_type: 0,
      width: '',
      height: '',
      depth: '',
      weight: '',
      resources: [],
      sku: [
        {
          attribute_value_ids: [],
          name: '',
          code: '',
          bar_code: '',
          original_price: 0,
          price: 0,
          stock: 0,
          low_stock: 0,
          sort: 0,
          resource_id: 0,
          width: 0,
          height: 0,
          depth: 0,
          weight: 0,
          attribute_info: {}
        }
      ],
      property: []
    },
    items: [
      {
        // 导航名称
        text: '食品',
        // 禁用选项
        disabled: false,
        // 该导航下所有的可选项
        children: [
          {
            text: '食品',
            id: 1,
            disabled: false
          },
          {
            text: '休闲零食',
            id: 2
          },
          {
            text: '进口食品',
            id: 3
          }
        ]
      },
      {
        text: '美妆护肤',
        children: [
          {
            text: '美容护肤',
            id: 1,
            disabled: false
          },
          {
            text: '彩妆/香水/美妆工具',
            id: 2
          },
          {
            text: '美发/护发/假发',
            id: 3
          }
        ]
      },
      {
        text: '服饰',
        children: [
          {
            text: '服饰配件/皮带/帽子/围巾',
            id: 1,
            disabled: false
          },
          {
            text: '服饰配件/皮带/帽子/围巾',
            id: 2
          },
          {
            text: '女装',
            id: 3
          },
          {
            text: '男装',
            id: 4
          },
          {
            text: '女士内衣/男士内衣/家居服',
            id: 5
          },
          {
            text: '运动户外',
            id: 6
          }
        ]
      },
      {
        text: '鞋类箱包',
        children: []
      },
      {
        text: '母婴',
        children: []
      },
      {
        text: '居家日用',
        children: []
      },
      {
        text: '珠宝配饰',
        children: []
      },
      {
        text: '3C数码',
        children: []
      },
      {
        text: '图书音像',
        children: []
      },
      {
        text: '餐饮美食',
        children: []
      },
      {
        text: '休闲娱乐',
        children: []
      },
      {
        text: '便民生活',
        children: []
      }
    ],
    popupData: {
      show: false
    },
    singleSku: true,
    mainShow: true,
    actions: [
      {
        name: '删除',
        color: '#fff',
        fontsize: '20',
        width: 100,
        background: '#ed3f14'
      }
    ],
    richText: '',
    modalControl: false
  },
  showModal: function(e) {
    this.setData({
      modalControl: true
    })
  },
  hideModal: function(e) {
    // this.setData({
    //     modalControl: false
    // })
  },
  onRadioChange(e) {
    this.setData({
      'test.radio': e.detail
    })
  },
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0
    })
  },
  onClickSelectCategory(e) {
    this.setData({
      'popupData.show': true,
      mainShow: false
    })
  },
  onClickItem({ detail = {} }) {
    this.setData({
      activeId: detail.id
    })
  },
  onClickPopupTagClose() {
    console.log('99999')
    this.setData({
      'popupData.show': false,
      mainShow: true
    })
  },
  onClickPopupTagOk() {
    // this.setData({
    //     'popupData.show': false
    // })
  },
  //删除图片
  deleteImage(event) {
    const that = this
    const id = event.currentTarget.dataset.id
    var resources = this.data.productInfo.resources
    resources.splice(resources.findIndex(item => item.id === id), 1)
    that.setData({
      'productInfo.resources': resources
    })
  },
  //图片上传
  merImageUpload() {
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
            const data = JSON.parse(res.data).data
            var resources = that.data.productInfo.resources
            resources.push(...data)
            that.setData({
              'productInfo.resources': resources
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
  saveContent(data) {
    console.log(data)
    this.setData({
      'productInfo.content': data
    })
  },
  onChangeProInfoName(e) {
    this.setData({
      'productInfo.name': e.detail
    })
  },
  onChangeProInfoDesc(e) {
    this.setData({
      'productInfo.description': e.detail
    })
  },
  onLoad: function() {
    // wx.showToast({
    //   title: '成功',
    //   icon: 'success',
    //   duration: 2000000
    // })
  },
  getUserInfo: function(e) {}
})
