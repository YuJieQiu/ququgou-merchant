const app = getApp()
import Toast from '../../components/vant-weapp/dist/toast/toast';
Page({
  data: {
    paymentTypeList: [],
    saveButtonLoading: false,
    readOnly: false,
    categoryInfos: [],
    productInfo: {
      id: 0,
      brandId: 0,
      categoryIds: [0],
      name: '',
      typeId: 0,
      status: 0,
      content: {
        content: '',
        contentRemark: ''
      },
      paymentTypeIds: [],
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
      active: true,
      status: 1,
      sku: [
        {
          id: 0,
          attribute_values: [],
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
          attributeValue: '',
          isSingleAttribute: true, //单规格
          images: { url: '' }, //展示
          attributeInfo: []
        }
      ],
      property: [],
      isSingle: true //是否单品
    },
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
  showModal: function (e) {
    this.setData({
      modalControl: true
    })
  },
  hideModal: function (e) {
    // this.setData({
    //     modalControl: false
    // })
  },
  onRadioChange(e) {
    this.setData({
      'test.radio': e.detail
    })
  },
  //删除图片
  deleteImage(event) {
    const that = this
    const id = event.currentTarget.dataset.id
    const index = event.currentTarget.dataset.index
    var resources = that.data.productInfo.resources
    resources.splice(index, 1)
    console.log(index)
    that.setData({
      'productInfo.resources': resources
    })
    return
  },
  //图片上传
  onImageUpload(e) {
    const callback = e.currentTarget.dataset.callback
    const that = this
    let token = wx.getStorageSync('token')

    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '上传中...',
          mask: true
        })
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
            wx.hideLoading()
            const data = JSON.parse(res.data).data[0]
            if (callback === 'merImagesLoad') {
              that.merImagesLoad(data)
            } else if (callback === 'skuImagesLoad') {
              const index = e.currentTarget.dataset.index
              that.skuImagesLoad(data, index)
            }
          },
          fail(err) {
            wx.hideLoading()
            $Toast({
              content: '上传失败' + err,
              type: 'error'
            })
          }
        })
      }
    })
  },
  merImagesLoad: function (data) {
    const that = this
    var resources = that.data.productInfo.resources
    resources.push({
      resourceId: data.id,
      type: 0,
      cover: resources.length == 0 ? true : false,
      position: resources.length + 1,
      resource: data
    })
    that.setData({
      'productInfo.resources': resources
    })
  },
  skuImagesLoad: function (data, index) {
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
      skus[0].attributeInfo = [
        {
          aid: 0,
          attName: '规格',
          vid: 0,
          valueName: ''
        }
      ]
      this.setData({
        'productInfo.isSingle': false,
        'productInfo.sku': skus
      })
      return
    }

    skus.push({
      id: skus.length,
      stock: null,
      price: null,
      attributeInfo: [
        {
          aid: 0,
          attName: '规格',
          vid: 0,
          valueName: ''
        }
      ],
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
  setValueParseFloat: function (value) {
    let v = value

    if (value.indexOf('.') != -1) {
      let subStr = value.substr(value.indexOf('.') + 1)
      console.log(subStr)
      if (subStr.length == 1 && subStr != "0") {
        v = parseFloat(parseFloat(value).toFixed(1))
      } else if (subStr.length > 1) {
        v = parseFloat(parseFloat(value).toFixed(2))
      }
    } else {
      v = parseFloat(value)
    }

    //[0]\.\d{1,2}|
    //const rule = /^(([1-9][0-9]*)|(([1-9][0-9]*\.\d{1,2})))$/
    // if (rule.test(v) && value[value.length - 1] != 0) {
    //   v = parseFloat(value)
    // } else {
    //   console.log(value.substr(value.indexOf('.') + 1).length)
    //   if (
    //     value.indexOf('.') != -1 &&
    //     value.indexOf('.') != 0 &&
    //     value.indexOf('.') != value.length - 1
    //   ) {
    //     if (value.substr(value.indexOf('.') + 1).length < 2) {
    //       v = parseFloat(value).toFixed(1)
    //     } else if (value.substr(value.indexOf('.') + 1).length > 1) {
    //       v = parseFloat(value).toFixed(2)
    //     } 
    //   } else {
    //   }
    // }
    return v
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
    const that = this
    this.setData({
      'productInfo.originalPrice': that.setValueParseFloat(e.detail)
    })
  },
  onChangeProInfoMinPrice(e) {
    const that = this
    this.setData({
      'productInfo.minPrice': that.setValueParseFloat(e.detail)
    })
  },
  onChangeProInfoMaxPrice(e) {
    const that = this
    this.setData({
      'productInfo.maxPrice': that.setValueParseFloat(e.detail)
    })
  },
  onChangeProInfoCurrentPrice(e) {
    const that = this
    this.setData({
      'productInfo.currentPrice': that.setValueParseFloat(e.detail),
      'productInfo.sku[0].price': that.setValueParseFloat(e.detail)
    })
  },
  onChangeMuchSkuAtt(e) {
    const index = e.currentTarget.dataset.index
    var sku = this.data.productInfo.sku
    sku[index].attributeInfo = [
      {
        aid: 0,
        attName: '规格',
        vid: 0,
        valueName: e.detail
      }
    ]
    //sku[index].singleAttributeValue = e.detail
    this.setData({
      'productInfo.sku': sku
    })
  },
  onChangeMuchSkuPrice(e) {
    const index = e.currentTarget.dataset.index
    var sku = this.data.productInfo.sku
    sku[index].price = this.setValueParseFloat(e.detail)
    this.setData({
      'productInfo.sku': sku
    })
  },
  onChangeMuchSkuStock(e) {
    const index = e.currentTarget.dataset.index
    var sku = this.data.productInfo.sku
    sku[index].stock = parseInt(e.detail)

    this.setData({
      'productInfo.sku': sku
    })
  },
  getProductInfo() {
    const that = this
    app
      .httpGet('product/get', {
        productId: that.data.productInfo.id
      })
      .then(res => {
        const data = res.data
        this.setData({
          productInfo: data,
          categoryInfos: data.categoryInfos
        })
      })
  },
  //保存信息
  saveSubmit() {
    var that = this
    //that.setData({ 'saveButtonLoading': true })
    if (that.data.categoryInfos != null && that.data.categoryInfos.length > 0) {
      let categoryIds = []

      that.data.categoryInfos.forEach(element => {
        categoryIds.push(parseInt(element.categoryId))
      });
      this.setData({
        'productInfo.categoryIds': categoryIds
      })
    } else {
      this.setData({
        'productInfo.categoryIds': [parseInt(0)]
      })
    }

    let newList = []
    that.data.productInfo.paymentTypeIds.forEach(element => {
      newList.push(parseInt(element))
    });
    this.setData({
      'productInfo.paymentTypeIds': newList
    })

    let url = 'product/create'
    if (this.data.saveType == 1) {
      url = 'product/update'
    }
    app.httpPost(url, that.data.productInfo, true).then(res => {
      let data = res.data
      //that.setData({ 'saveButtonLoading': true })
      if (res.code == 200) {
        wx.reLaunch({
          url: '/pages/productManage/index'
        })
      } else {
        Toast.fail('失败' + res.message);
      }
    })
  },
  //支付方式选择
  onPayTypeChange(event) {
    let list = event.detail

    this.setData({
      'productInfo.paymentTypeIds': list
    });
  }
  ,
  PayTypeToggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },
  PayTypeNoop() { },
  getPaymentTypeList: function () {
    const that = this
    app
      .httpGet('get/product/pay/type/list', {})
      .then(res => {
        const data = res.data
        if (data != null) {
          this.setData({
            paymentTypeList: data
          })
        }
      })
  },
  onShow() {

  },
  onLoad: function (options) {
    this.data.id = options.id
    if (typeof options.id !== 'undefined' && options.id > 0) {
      this.setData({
        'productInfo.id': options.id,
        saveType: 1
      })
      this.getPaymentTypeList(this.getProductInfo())
    } else {
      this.getPaymentTypeList()
    }
    // wx.showToast({
    //   title: '成功',
    //   icon: 'success',
    //   duration: 2000000
    // })
  }
})
