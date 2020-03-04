var app = getApp();

Page({
  data: {
    menuHeight: "", //菜单高度
    activeId: 0,
    selectInfos: [{
      categoryId: 0,
      categoryName: ""
    }],
    mainActiveIndex: 0,
    list: [],
    items: [],
    isProductCategory: true,
    url: ''//'mer/product/category/get'
  },
  getDataInfo() {
    const that = this
    app.httpGet(that.data.url, {}).then(res => {
      wx.stopPullDownRefresh()
      if (res.data != null && res.data.length > 0) {
        let list = res.data
        let items = []

        list.forEach(element => {
          let childs = []
          if (element.child != null && element.child.length > 0) {
            element.child.forEach(child => {
              childs.push({
                id: child.id,
                text: child.name,
                disabled: false,
                children: []
              })
            });
          }

          items.push({
            id: element.id,
            text: element.name,
            disabled: false,
            children: childs
          })
        });

        that.setData({
          list: res.data,
          items: items
        })
      }
    })
  },
  onClickNav({ detail = {} }) {
    let mainActiveIndex = detail.index
    this.setData({
      mainActiveIndex: mainActiveIndex || 0
    })

    let selectInfos = []
    let items = this.data.items
    selectInfos[0] = {
      categoryId: items[mainActiveIndex].id,
      categoryName: items[mainActiveIndex].text
    }
    this.setData({
      selectInfos: selectInfos
    })
    console.log(this.data.selectInfos)
  },
  onClickItem({ detail = {} }) {
    let selectInfos = this.data.selectInfos
    let items = this.data.items
    let mainActiveIndex = this.data.mainActiveIndex

    if (mainActiveIndex == 0) {
      selectInfos[0] = {
        categoryId: items[mainActiveIndex].id,
        categoryName: items[mainActiveIndex].text
      }
    }
    // selectInfos.push({
    //   categoryId: items[mainActiveIndex].id,
    //   categoryName: items[mainActiveIndex].text
    // })
    selectInfos[1] = {
      categoryId: detail.id,
      categoryName: detail.text
    }

    this.setData({
      activeId: detail.id,
      selectInfos: selectInfos
    })
    console.log(this.data.selectInfos)
  },
  onClickPopupTagClose() {
    this.backBeforePage()
  },
  backBeforePage() {
    const that = this
    //返回上一个页面
    let arrPages = getCurrentPages()
    arrPages[arrPages.length - 2].setData({
      categoryInfos: that.data.selectInfos
    })
    wx.navigateBack({
      delta: arrPages.length - (arrPages.length - 1),
      success: res => {
      },
      fail: function (res) { },
      complete: function (res) { }
    })
  },
  onClickPopupTagOk() {
    this.backBeforePage()
  },
  onLoad(options) {
    // if (options.id != null && options.id > 0) {
    //   this.setData({
    //     'selectInfo.categoryId': options.id
    //   })
    // }

    // if (options == null || options.type == 0) {
    //   this.setData({ url: 'product/category/get' }) //系统分类
    // } else {
    //   this.setData({ url: 'mer/product/category/get' }) //商家商品分类
    // }

    this.setData({ url: 'product/category/get' }) //系统分类

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          menuHeight: res.windowHeight - res.windowWidth / 750 * 92,
        });
      }
    });
    this.getDataInfo()
  }
})