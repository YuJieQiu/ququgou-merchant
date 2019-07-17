const app = getApp()

Page({
  data: {
    value5: '',
    readOnly: false,
    productInfo: {
      brandId: 0,
      categoryIds: [],
      name: '',
      typeId: 0,
      status: 0,
      content: '',
      contentRemark: '',
      description: '',
      keywords: '',
      tags: [],
      originalPrice: null, //原始价格 (下划线价格) 展示使用
      minPrice: null,
      maxPrice: null,
      currentPrice: 0,
      sales: null,
      productType: 0,
      width: null,
      height: null,
      depth: null,
      weight: null,
      resources: [],
      sku: [
        {
          attributeValueIds: [],
          name: '',
          code: '',
          barCode: '',
          originalPrice: 0,
          price: 0,
          stock: 0,
          lowStock: 0,
          sort: 0,
          resourceId: 0,
          width: 0,
          height: 0,
          depth: 0,
          weight: 0,
          attributeInfo: {},
          attributeValue: '',
          images: { url: '' } //展示
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
            const data = JSON.parse(res.data).data
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
    resources.push(...data)
    that.setData({
      'productInfo.resources': resources
    })
  },
  skuImagesLoad: function(data, index) {
    const that = this
    var sku = that.data.productInfo.sku
    sku[index].resourceId = data[0].id
    sku[index].images = data[0]
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
    console.log(data)
    this.setData({
      'productInfo.content': data
    })
  },
  onClickAttAdd() {
    if (this.data.singleSku) {
      this.setData({
        singleSku: false,
        'productInfo.sku': []
      })
    }
    let skus = this.data.productInfo.sku

    skus.push({ id: skus.length })
    this.setData({
      'productInfo.sku': skus
    })
    console.log(this.data.productInfo.sku)
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
        singleSku: true,
        'productInfo.sku': [{ id: 0 }]
      })
    }
    console.log(this.data.productInfo.sku)
  },
  onChangeProInfoName(e) {
    this.setData({
      'productInfo.name': e.detail,
      'productInfo.currentPrice': 1
    })
  },
  onChangeProInfoDesc(e) {
    this.setData({
      'productInfo.description': e.detail
    })
  },
  onChangeProInfoWidth(e) {
    this.setData({
      'productInfo.width': e.detail
    })
  },
  onChangeProInfoHeight(e) {
    this.setData({
      'productInfo.height': e.detail
    })
  },
  onChangeProInfoDepth(e) {
    this.setData({
      'productInfo.depth': e.detail
    })
  },
  onChangeProInfoWeight(e) {
    this.setData({
      'productInfo.weight': e.detail
    })
  },
  onChangeProInfoOriginalPrice(e) {
    this.setData({
      'productInfo.originalPrice': e.detail
    })
  },
  onChangeProInfoMinPrice(e) {
    this.setData({
      'productInfo.minPrice': e.detail
    })
  },
  onChangeProInfoMaxPrice(e) {
    this.setData({
      'productInfo.maxPrice': e.detail
    })
  },

  onChangeProInfoCurrentPrice(e) {
    this.setData({
      'productInfo.currentPrice': e.detail
    })
  },

  onBlurProInfoCurrentPrice(e) {
    let number = parseFloat(e.detail.value).toFixed(2)
    if (number == 'NaN') {
      number = 0
    }
    e.detail.value = number
    //console.log(number)
    this.setData({
      'productInfo.currentPrice': number
    })
    //console.log(parseFloat(number))
    // if (Number.parseFloat(number) != 'NaN') {
    //   console.log(parseFloat(number).toFixed(2))
    // }
    // this.setData({
    //   'productInfo.currentPrice': number
    // })
    // let number = parseFloat(e.detail.value).toFixed(2)
    // console.log(number)
    //console.log(this.data.productInfo.currentPrice)
  },
  onChangeMuchSkuAtt(e) {
    const index = e.currentTarget.dataset.index
    var sku = this.data.productInfo.sku
    sku[index].attributeValue = e.detail
    this.setData({
      'productInfo.sku': sku
    })
  },
  onChangeMuchSkuPrice(e) {
    const index = e.currentTarget.dataset.index
    var sku = this.data.productInfo.sku
    sku[index].price = e.detail
    this.setData({
      'productInfo.sku': sku
    })
  },
  onChangeMuchSkuSort(e) {
    const index = e.currentTarget.dataset.index
    var sku = this.data.productInfo.sku
    sku[index].sort = e.detail
    this.setData({
      'productInfo.sku': sku
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
  onLoad: function() {
    // wx.showToast({
    //   title: '成功',
    //   icon: 'success',
    //   duration: 2000000
    // })
  },
  getUserInfo: function(e) {}
})
