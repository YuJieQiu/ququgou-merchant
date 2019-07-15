const app = getApp()
const {appValidate} = require('../../utils/util.js');

Page({
    data: {
        tabCur: 0,
        tabList: ["问答题", "GPS定位"],
        dotData: {},
        question: {},
        type: 'normal', // normal: 正常搜索点, center: 自定义点
        eventPics: [],
        description: ''
    },
    picDel(e) {
        let target = e.currentTarget;

        let index = target.dataset.index;

        let eventPics = this.data.eventPics;

        eventPics.splice(index, 1);

        this.setData({
            eventPics: eventPics
        });
    },
    chooseImage() {
        let _this = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                const tempFilePaths = res.tempFilePaths

                let token = wx.getStorageSync('token');

                wx.showLoading({
                    title: '上传中...',
                });

                wx.uploadFile({
                    url: app.baseUrl + '/uploadImages',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    header: {
                        token: token
                    },
                    formData: {
                        user: 'test'
                    },
                    success(res) {
                        wx.hideLoading();
                        let result = JSON.parse(res.data);
                        let pic = result.data[0];
                        let eventPics = _this.data.eventPics;
                        eventPics.push(pic);
                        _this.setData({
                            eventPics: eventPics
                        })
                    },
                    fail: function(res) {
                        wx.hideLoading();
                        wx.showToast({
                            title: '网络出错',
                            icon: 'none'
                        });
                    }
                })
            }
        })
    },
    nameInput(e) {
        let dotData = this.data.dotData;
        dotData.name = e.detail.value
        this.setData({
            dotData: dotData
        });
    },
    addressInput(e) {
        let dotData = this.data.dotData;
        dotData.location_name = e.detail.value
        this.setData({
            dotData: dotData
        });
    },
    descriptionInput(e) {
        this.setData({
            description: e.detail.value
        });
    },
    chooseTab: function (event) {
        let target = event.currentTarget;

        let tabCur = target.dataset.index;

        this.setData({
            tabCur: tabCur
        });
    },
    questionSelect() {
        wx.navigateTo({
            url: "/pages/questionList/index?type=selectQuestion"
        })
    },
    save() {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 3];
        let dotData = this.data.dotData;
        let questionId = 0;

        if(appValidate.isNullOrEmpty(dotData.name)) {
            wx.showToast({
                title: '请输入点位名称',
                icon: 'none'
            });
            return;
        }

        if(appValidate.isNullOrEmpty(dotData.location_name)) {
            wx.showToast({
                title: '请输入点位地址信息',
                icon: 'none'
            });
            return;
        }

        if(this.data.tabCur === 0 ) {
            if(appValidate.isNullOrEmpty(this.data.question.id)) {
                wx.showToast({
                    title: '请选择问答题',
                    icon: 'none'
                });
                return;
            }
            questionId = this.data.question.id;
        }

        if(this.data.eventPics.length === 0) {
            wx.showToast({
                title: '请至少选择一张提示图片',
                icon: 'none'
            });
            return;
        }

        if(appValidate.isNullOrEmpty(this.data.description)) {
            wx.showToast({
                title: '请输入该点任务详细规则',
                icon: 'none'
            });
            return;
        }

        let data = {
            name: dotData.name,
            location_name: dotData.location_name,
            latitude: dotData.latitude,
            longitude: dotData.longitude,
            type: this.data.tabCur + 1,
            question_id: questionId,
            description: this.data.description,
            images: this.data.eventPics
        };

        prevPage.dotAdd(data);

        wx.navigateBack({
            delta: 2
        });

    },
    onLoad(options) {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        if(options.type === 'center') {
            let dotData = prevPage.data.centerDot;
            this.setData({
                type: 'center',
                dotData: {
                    name: '',
                    location_name: '',
                    latitude: dotData.latitude,
                    longitude: dotData.longitude
                }
            });
        } else {
            let dotData = prevPage.data.dotData;
            this.setData({
                type: 'normal',
                dotData: {
                    name: dotData.title,
                    location_name: dotData.address,
                    latitude: dotData.location.lat,
                    longitude: dotData.location.lng
                }
            });
        }

    }
})
