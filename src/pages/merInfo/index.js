const app = getApp()
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const qqmapsdk = new QQMapWX({ key: app.mapKey });
Page({
    data: {
        region: ['上海', '上海市', '徐家汇'],
        businessStartTime: '06:00',
        businessEndTime: '21:00',
        show: true,
        username: '',
        password: '',
        tabList: [],
        tabData: {
            tagList: ['标签1', '标签1', '标签1', '标签1', '标签1', '标签1', '标签1'],
            tagHotList: ['标签热门1', '标签热门2', '标签热门3', '标签热门4', '标签热门5', '标签热门6'],
            tabNewStr: "",
            hideSelect: false,
            hideNew: true,
            hideTot: false,
            show: false,
        }
    },
    onChangeStartTime(e) {

        this.setData({
            businessStartTime: e.detail.value,
        })
    },
    onChangeEndTime(e) {
        this.setData({
            businessEndTime: e.detail.value,
        })
    },
    onAddressClick() {
        wx.getLocation({
            type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
            success(res) {
                const latitude = res.latitude
                const longitude = res.longitude
                wx.openLocation({
                    latitude,
                    longitude,
                    scale: 18
                })
            }
        })
    },
    onClose(event) {
        if (event.detail === 'confirm') {
            // 异步关闭弹窗
            setTimeout(() => {
                this.setData({
                    show: false
                });
            }, 1000);
        } else {
            this.setData({
                show: false
            });
        }
    },
    onTagSearch(e) {
        if (e.detail == "") {
            this.setData({
                'tabData.tabNewStr': "",
                'tabData.hideNew': true,
                'tabData.hideSelect': false,
                'tabData.hideTot': false
            })
        } else {
            this.setData({
                'tabData.tabNewStr': e.detail,
                'tabData.hideNew': false,
                'tabData.hideSelect': true,
                'tabData.hideTot': true
            })
        }
    },
    onClickPopupTagClose() {
        this.setData({
            'tabData.show': false
        })
    },
    onClickPopupTagOk() {
        this.setData({
            'tabList': this.data.tabData.tagList,
            'tabData.tagList': [],
            'tabData.show': false
        })
    },
    onClickDeleteTag(e) {
        let value = e.currentTarget.dataset.value
        let list = this.data.tabData.tagList
        let newList = list.filter(item => item !== value)
        this.setData({
            'tabData.tagList': newList
        })
    },
    onClickHotTag(e) {
        let value = e.currentTarget.dataset.value
        let list = this.data.tabData.tagList
        list.push(value)
        this.setData({
            'tabData.tagList': list
        })
    },
    onClickTag(e) {
        let list = this.data.tabData.tagList
        list.push(this.data.tabData.tabNewStr)
        this.setData({
            'tabData.tabNewStr': "",
            'tabData.hideNew': true,
            'tabData.hideSelect': false,
            'tabData.hideTot': false,
            'tabData.tagList': list
        })
        console.log(this.data.tabData)
    },
    onClickSelectTag() {
        this.setData({
            'tabData.show': true,
            'tabData.tagList': this.data.tabList
        })
    },
    onInput(event) {
        this.setData({
            currentDate: event.detail.value
        });
    },
    onLoad: function () {

    },
    getUserInfo: function (e) {

    }
})
