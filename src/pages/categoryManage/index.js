var app = getApp();

Page({
  data: {
    activeId: 0,
    selectInfos: [{
      categoryId: 0,
      categoryName: ""
    }],
    mainActiveIndex: 0,
    list: [],
    items: []
  },
  getDataInfo() {
    const that = this
    app.httpGet('product/category/get', {}).then(res => {
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
    this.setData({
      mainActiveIndex: detail.index || 0
    })
  },
  onClickItem({ detail = {} }) {
    let selectInfos = []
    let items = this.data.items
    let mainActiveIndex = this.data.mainActiveIndex
    selectInfos.push({
      categoryId: items[mainActiveIndex].id,
      categoryName: items[mainActiveIndex].text
    })
    selectInfos.push({
      categoryId: detail.id,
      categoryName: detail.text
    })

    this.setData({
      activeId: detail.id,
      selectInfos: selectInfos
    })
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
    this.getDataInfo()
  }
})