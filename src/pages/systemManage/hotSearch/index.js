var app = getApp();
import Toast from '../../../components/vant-weapp/dist/toast/toast';
Page({
  data: {
    list: []
  },
  getDataInfo() {
    const that = this
    app.httpGet('hot/search/get', {}).then(res => {
      wx.stopPullDownRefresh()
      if (res.data != null && res.data.length > 0) {
        that.setData({
          list: res.data
        })
      }
    })
  },
  addItem(e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    var list = this.data.list
    list.push({
      id: 0,
      text: '',
      isHome: true,
      sort: list.length + 1
    })
    this.setData({
      list: list
    })
  },
  deleteItem(e) {
    const id = e.currentTarget.dataset.id
    const item = e.currentTarget.dataset.item
    const index = e.currentTarget.dataset.index

    var list = this.data.list

    list.splice(index, 1)

    this.setData({
      list: list
    })
  },
  onChangeText(e) {
    var that = this
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const field = e.currentTarget.dataset.field
    const type = e.currentTarget.dataset.type
    var text = e.detail
    let changefield = `list[${index}].${field}`

    if (type == 'int') {
      text = parseInt(text)
    }
    this.setData({
      [changefield]: text
    })
  },
  //保存更新数据
  saveSubmit() {
    var that = this
    let data = {
      list: that.data.list
    }
    app.httpPost('hot/search/save', data, true).then(res => {
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