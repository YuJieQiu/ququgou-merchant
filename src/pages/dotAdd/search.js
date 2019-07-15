const app = getApp();
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const qqmapsdk = new QQMapWX({key: app.mapKey});

Page({
    data: {
        listData: [],
        city: undefined,
        timer: null
    },
    bindInput: function (e) {
        clearTimeout(this.data.timer);

        let timer = setTimeout(() => {
            let that = this;
            let keywords = e.detail.value;

            qqmapsdk.getSuggestion({
                keyword: keywords,
                region: this.data.city,
                success: function(res) {
                    if (res && res.status === 0 && res.data) {
                        that.setData({
                            listData: res.data
                        });
                    }
                },
                fail: function(res) {
                    console.log(res);
                }
            });

        }, 300);

        this.setData({
            timer: timer
        });

    },
    bindSearch: function (e) {
        let index = e.currentTarget.dataset.index;
        let dotData = this.data.listData[index];

        qqmapsdk.search({
            keyword: dotData.title,
            location: dotData.location.lat + ',' + dotData.location.lng,
            success: function (res) { //搜索成功后的回调
                if(res && res.status === 0) {
                    if(res.data && res.data.length > 0) {
                        let pages = getCurrentPages();
                        let prevPage = pages[pages.length - 2];
                        if (prevPage) {
                            prevPage.generateMarkers(res.data, res.data[0].id);
                            prevPage.setData({
                                keyword: dotData.title,
                                latitude: dotData.location.lat,
                                longitude: dotData.location.lng,
                                scale: 18
                            });
                            wx.navigateBack();
                        }
                    } else {
                        wx.showToast({
                            title: '啥都没搜到,换个试试',
                            icon: 'none'
                        });
                    }
                } else {
                    wx.showToast({
                        title: res.message,
                        icon: 'none'
                    });
                }
            },
            fail: function (res) {
                console.log(res);
            }
        });
    },
    onLoad: function (options) {
        this.setData({
            city: options.city
        });
    }
})