var app = getApp();
import Toast from '../../components/vant-weapp/dist/toast/toast';
const { strMapToObj } = require('../../utils/util.js')
Page({
  data: {
    selectTabList: [],
    tabData: {
      tagList: [],
      tabNewStr: '',
      hideSelect: false,
      hideNew: true,
      hideTot: false
    }
  },
  getTagList() {
    var that = this
    app.httpGet('label/get/list', {}).then(res => {
      let data = res.data
      console.log(res.data)
      that.setData({
        'tabData.tagList': data
      })
    })
  },
  //创建标签
  onTagSearch(e) {
    var that = this
    if (e.detail == '') {
      this.setData({
        'tabData.tabNewStr': '',
        'tabData.hideNew': true,
        'tabData.hideSelect': false,
        'tabData.hideTot': false
      })
    } else {
      that.setData({
        'tabData.tabNewStr': e.detail,
        'tabData.hideNew': false,
        'tabData.hideSelect': true,
        'tabData.hideTot': true
      })
    }
  },
  //创建
  onClickCreateTag(e) {
    if (this.data.selectTabList.length > 4) {
      Toast('最多选择5个');
      return
    }
    var that = this
    let list = this.data.tabData.tagList
    let selectList = this.data.selectTabList
    //创建标签
    app
      .httpPost('label/create', {
        text: that.data.tabData.tabNewStr,
        sort: that.data.tabData.tagList.length + 1
      })
      .then(res => {
        let data = res.data
        console.log(res.data)
        list.push({
          id: data.id,
          text: data.text
        })
        selectList.push({
          id: data.id,
          text: data.text
        })

        this.setData({
          'tabData.tabNewStr': '',
          'tabData.hideNew': true,
          'tabData.hideSelect': false,
          'tabData.hideTot': false,
          'tabData.tagList': list,
          selectTabList: selectList
        })
      })
  },
  //删除
  onClickDeleteTag(e) {
    let value = e.currentTarget.dataset.value
    let id = e.currentTarget.dataset.id
    let list = this.data.selectTabList
    let newList = list.filter(item => item.id !== id)
    this.setData({
      selectTabList: newList
    })
  },
  //选择
  onClickHotTag(e) {
    if (this.data.selectTabList.length > 4) {
      Toast('最多选择5个');
      return
    }

    let text = e.currentTarget.dataset.text
    let id = e.currentTarget.dataset.id
    let list = this.data.selectTabList

    console.log(list)
    list.push({ id: id, text: text })
    this.setData({
      selectTabList: list
    })
  },
  //取消
  onClickPopupTagClose() {
    this.backBeforePage()
  },
  backBeforePage() {
    const that = this

    let label = new Map()
    that.data.selectTabList
    that.data.selectTabList.forEach(element => {
      label.set(element.id, element.text)
    })
    //返回上一个页面
    let arrPages = getCurrentPages()
    arrPages[arrPages.length - 2].setData({
      "merInfo.label": strMapToObj(label)
    })
    wx.navigateBack({
      delta: arrPages.length - (arrPages.length - 1),
      success: res => {
      },
      fail: function (res) { },
      complete: function (res) { }
    })
  },
  //确认
  onClickPopupTagOk() {
    this.backBeforePage()
  },
  onLoad() {
    this.getTagList()
  }
})