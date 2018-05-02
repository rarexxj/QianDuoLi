//index.js
//获取应用实例
const app = getApp()
app.load.show();
Page({
    data: {
        config: app.config,
        banner: [],
        searchVal: '',
        home: {},
        msgShow: false,
        msgTitle: '',
        mall: [],
        mallBtn: false
    },
    onLoad: function (options) {
        let t = this;
        console.log(app.config.api_url)
        console.log(1+options)
        console.log(options.InvitationCode)
        if (options.InvitationCode) {
            wx.setStorageSync('FatherCode', options.InvitationCode)
        }
        app.checkLogin();
        t.home();
        t.banner();
    },
    home: function () {
        let t = this;
        console.log(99999)
        wx.request({
            method: 'GET',
            url: t.data.config.api_url + 'api/v1/mall/home',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                res = res.data;
                if (res.ReturnCode == '200') {
                    for (var i = 0; i < res.Data.Adverts.length; i++) {
                        if (res.Data.Adverts[i].ShotUrl) {
                            var id = res.Data.Adverts[i].ShotUrl.split('|')[1];
                            var type = res.Data.Adverts[i].ShotUrl.split('|')[0];

                            if (type == 'Goods') {
                                res.Data.Adverts[i].url = '../productsInfo/productsInfo?id=' + id;
                            }
                            if (type == 'ServiceGoods') {
                                res.Data.Adverts[i].url = '../productsInfoService/productsInfoService?id=' + id;
                            }
                        }
                    }
                    t.setData({
                        home: res.Data
                    })
                    app.load.hide();
                } else {
                    t.msgShow(res.Msg)
                }
            }
        })
    },
    banner: function () {
        let t = this;
        wx.request({
            method: 'GET',
            url: t.data.config.api_url + 'api/v1/carousel/01',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                res = res.data;
                if (res.ReturnCode == '200') {
                    for (var i = 0; i < res.Data.length; i++) {
                        if (res.Data[i].ShotUrl) {
                            var id = res.Data[i].ShotUrl.split('|')[1];
                            var type = res.Data[i].ShotUrl.split('|')[0];
                            res.Data[i].id = id;
                            res.Data[i].type = type;

                        }
                        t.setData({
                            banner: res.Data
                        })
                    }

                } else {
                    t.msgShow(res.Msg)
                }
            }
        })
    },
    searchInput: function (e) {
        let t = this;
        t.setData({
            searchVal: e.detail.value
        })
        if (e.detail.value.length) {
            t.setData({
                mallBtn: true
            })
        } else {
            t.setData({
                mallBtn: false
            })
        }

    },
    search: function () {
        let t = this;
        wx.navigateTo({
            url: '../productsList/productsList?KeyWord=' + t.data.searchVal
        })
    },
    searchTo: function () {
        let t = this;
        wx.navigateTo({
            url: '../productsList/productsList?to=true'
        })
    },
    //msg
    msgShow(msgTitle = '请填写提示文字', time, callback) {
        let _this = this;

        _this.setData({
            msgShow: true,
            msgTitle: msgTitle
        });

        clearTimeout(_this.timeBox);
        _this.timeBox = setTimeout(() => {
            _this.setData({
                msgShow: false
            });

            if (typeof (callback) == 'function') {
                callback()
            } else {

            }
        }, (time ? time : 1) * 2000);
    },
    onShareAppMessage: function (res) {
      let t=this;
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: '千多利商城',
        path: '/pages/index/index',
        success: function (res) {
          // t.msgShow('转发成功')
          // 转发成功
        },
        fail: function (res) {
          // t.msgShow('转发失败')
          // 转发失败
        }
      }
    }
})
