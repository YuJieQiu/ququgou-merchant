const app = getApp()

Page({
  data: {
    readOnly: false,
    productInfo: {
      id: 0,
      brandId: 0,
      categoryIds: [],
      name: '',
      typeId: 0,
      status: 0,
      content: {
        content: '',
        contentRemark: ''
      },
      description: '',
      keywords: [],
      tags: [],
      originalPrice: null, //原始价格 (下划线价格) 展示使用
      minPrice: null,
      maxPrice: null,
      currentPrice: null,
      sales: null,
      productType: 0,
      width: null,
      height: null,
      depth: null,
      weight: null,
      resources: [],
      sku: [
        {
          id: 0,
          attributeValueIds: [],
          name: '',
          code: '',
          barCode: '',
          originalPrice: null,
          price: null,
          stock: null,
          lowStock: null,
          sort: null,
          resourceId: 0,
          width: null,
          height: null,
          depth: null,
          weight: null,
          attributeInfo: {},
          attributeValue: '',
          singleAttributeValue: '',
          isSingleAttribute: false, //单规格
          images: { url: '' } //展示
        }
      ],
      property: [],
      isSingle: true //是否单品
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
    modalControl: false,
    saveType: 0 //0新增 1更新
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
            if (callback === 'merImagesLoad') {
              that.merImagesLoad(data)
            } else if (callback === 'skuImagesLoad') {
              const index = e.currentTarget.dataset.index
              that.skuImagesLoad(data, index)
            }
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
  merImagesLoad: function(data) {
    const that = this
    var resources = that.data.productInfo.resources
    resources.push({
      resourceId: data.id,
      type: 0,
      cover: resources.length == 0 ? true : false,
      position: resources.length + 1,
      url: data.url,
      resource: []
    })
    that.setData({
      'productInfo.resources': resources
    })
  },
  skuImagesLoad: function(data, index) {
    const that = this
    var sku = that.data.productInfo.sku
    sku[index].resourceId = data.id
    sku[index].images = data
    that.setData({
      'productInfo.sku': sku
    })
  },
  skuImagesDelete(event) {
    const index = event.currentTarget.dataset.index
    const that = this
    var sku = that.data.productInfo.sku
    sku[index].resourceId = 0
    sku[index].images = {}
    that.setData({
      'productInfo.sku': sku
    })
  },
  saveContent(data) {
    this.setData({
      'productInfo.content.content': data
    })
  },
  onClickAttAdd() {
    var skus = this.data.productInfo.sku
    if (this.data.productInfo.isSingle) {
      skus[0].isSingleAttribute = true
      this.setData({
        'productInfo.isSingle': false,
        'productInfo.sku': skus
      })
      return
    }

    skus.push({
      id: skus.length,
      isSingleAttribute: true,
      sort: null,
      price: null,
      singleAttributeValue: '',
      isSingleAttribute: true
    })
    this.setData({
      'productInfo.sku': skus
    })
  },
  handleCancel2(event) {
    const that = this
    const id = event.currentTarget.dataset.id
    var sku = this.data.productInfo.sku
    sku.splice(sku.findIndex(item => item.id === id), 1)
    that.setData({
      'productInfo.sku': sku
    })
    if (sku.length === 0) {
      this.setData({
        'productInfo.isSingle': true,
        'productInfo.sku': [{ id: 0 }]
      })
    }
    console.log(this.data.productInfo.sku)
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
  onChangeProInfoWidth(e) {
    this.setData({
      'productInfo.width': parseFloat(e.detail)
    })
  },
  onChangeProInfoHeight(e) {
    this.setData({
      'productInfo.height': parseFloat(e.detail)
    })
  },
  onChangeProInfoDepth(e) {
    this.setData({
      'productInfo.depth': parseFloat(e.detail)
    })
  },
  onChangeProInfoWeight(e) {
    this.setData({
      'productInfo.weight': parseFloat(e.detail)
    })
  },
  onChangeProInfoOriginalPrice(e) {
    this.setData({
      'productInfo.originalPrice': parseFloat(e.detail)
    })
  },
  onChangeProInfoMinPrice(e) {
    this.setData({
      'productInfo.minPrice': parseFloat(e.detail)
    })
  },
  onChangeProInfoMaxPrice(e) {
    this.setData({
      'productInfo.maxPrice': parseFloat(e.detail)
    })
  },
  onChangeProInfoCurrentPrice(e) {
    let value = e.detail
    const rule = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/

    if (
      value.indexOf('.') != -1 &&
      value.indexOf('.') != 0 &&
      value.indexOf('.') != value.length - 1
    ) {
      if (!rule.test(value)) {
        value = parseFloat(e.detail).toFixed(2)
      }
    }
    if (value == 'NaN') {
      value = 0
    }
    this.setData({
      'productInfo.currentPrice': parseFloat(value)
    })
  },
  onChangeMuchSkuAtt(e) {
    const index = e.currentTarget.dataset.index
    var sku = this.data.productInfo.sku
    sku[index].singleAttributeValue = e.detail
    this.setData({
      'productInfo.sku': sku
    })
  },
  onChangeMuchSkuPrice(e) {
    const index = e.currentTarget.dataset.index
    var sku = this.data.productInfo.sku
    sku[index].price = parseFloat(e.detail)
    this.setData({
      'productInfo.sku': sku
    })
  },
  onChangeMuchSkuSort(e) {
    const index = e.currentTarget.dataset.index
    var sku = this.data.productInfo.sku
    sku[index].sort = parseInt(e.detail)

    this.setData({
      'productInfo.sku': sku
    })
  },
  getProductInfo() {
    console.log('getProductInfo')
    const that = this
    app
      .httpGet('product/get', {
        productId: that.data.productInfo.id
      })
      .then(res => {
        const data = res.data
        console.log(data)
      })
  },
  //保存信息
  saveSubmit() {
    var that = this
    app.httpPost('product/create', that.data.productInfo).then(res => {
      let data = res.data
      console.log(res)
    })
  },
  onLoad: function(options) {
    this.data.id = options.id
    console.log(options)
    if (options.id != '') {
      this.setData({
        'productInfo.id': options.id,
        saveType: 1
      })
      this.getProductInfo()
    }

    // wx.showToast({
    //   title: '成功',
    //   icon: 'success',
    //   duration: 2000000
    // })
  }
})
