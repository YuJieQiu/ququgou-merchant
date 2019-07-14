const app = getApp()

Page({
  data: {
    items:[
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
            disabled: false,
            
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
            disabled: false,
            
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
            disabled: false,
            
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
      },
    ],
    popupData: {
      show: false,
     },
     test:{
       mainShow:true,
      radio:2,
       list:[1,2,3,4,5],
       imageurl:"http://qiniu.media.q.dfocuspace.cn/static/images/0a04de2752ba41bc8f33ec4d077b462d.jpg?imageView2/2/w/308/h/210/interlace/1/q/100"
     },
     actions: [
      {
        name: '删除',
        color: '#fff',
        fontsize: '20',
        width: 100,
        background: '#ed3f14'
      }
    ],
    richText:"",
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
  onRadioChange(e){
    this.setData({
      'test.radio':e.detail
    })
  },
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0
    });
  },
  onClickSelectCategory(e){
    this.setData({
      'popupData.show':true,
      'test.mainShow':false
    })
  },
  onClickItem({ detail = {} }) {
    this.setData({
      activeId: detail.id
    });
  },
  onClickPopupTagClose() {
    console.log("99999")
    this.setData({
        'popupData.show': false,
        'test.mainShow':true
    })
}, 
onClickPopupTagOk() {
    // this.setData({
    //     'popupData.show': false
    // })
},
  onLoad: function () {
    // wx.showToast({
    //   title: '成功',
    //   icon: 'success',
    //   duration: 2000000
    // })
  },
  getUserInfo: function(e) {
    
  }
})
