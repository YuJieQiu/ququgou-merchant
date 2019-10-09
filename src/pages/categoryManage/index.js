var app = getApp();

Page({
  data: {
    activeId: 0,
    selectInfo: {
      categoryId: 0,
      categoryName: ""
    },
    mainActiveIndex: 0,
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
    ]
  },
  onClickNav({ detail = {} }) {
    console.log(detail)
    this.setData({
      mainActiveIndex: detail.index || 0
    })
  },
  onClickItem({ detail = {} }) {
    console.log(detail)
    this.setData({
      activeId: detail.id,
      'selectInfo.categoryId': detail.id,
      'selectInfo.categoryName': detail.text
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
      "categoryInfo.id": that.data.selectInfo.categoryId,
      "categoryInfo.name": that.data.selectInfo.categoryName,
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
})