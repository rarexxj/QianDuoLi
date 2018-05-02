// pages/partner/partner.js
let QR = require("../../libs/qrcode.js")
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    showBtn: '1',
    cashBag: {},
    center: {},
    comData: {
      PageNo: 1,
      Limit: 6
    },
    comPage: '',
    comInfo: [],
    parterData: {
      PageNo: 1,
      Limit: 6
    },
    parterPage: '',
    parterInfo: [],
    showMask: false,
    showSuccess: false,
    imagePath: '',
    InvitationCode: '',
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    t.init();
    t.cashBag();
    t.parter();
    t.commission();
    t.code();

  },

  choose: function (e) {
    var t = this;
    console.log(e)
    t.setData({
      showBtn: e.currentTarget.dataset.index
    })
  },
  init: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/member/info',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.setData({
            center: res.Data,
            InvitationCode: res.Data.Member.InvitationCode
          })

          console.log(res.Data.Member.InvitationCode)
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }
      }
    })
  },
  cashBag: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/wallet/commission',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.setData({
            cashBag: res.Data
          })
          console.log(t.data.cashBag.Available)

          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }
      }
    })

  },
  commission: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/member/commission',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: t.data.comData,
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.setData({
            comPage: Math.ceil(res.Data.TotalCount / t.data.comData.Limit),
            comInfo: t.data.comInfo.concat(res.Data.WalletBills)
          })
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }
      }
    })

  },
  parter: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/member/partner',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: t.data.parterData,
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.setData({
            parterPage: Math.ceil(res.Data.TotalCount / t.data.parterData.Limit),
            parterInfo: t.data.parterInfo.concat(res.Data.Partners)
          })
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }
      }
    })

  },
  comLoad: function () {
    console.log(3333);
    t.setData({
      'comData.PageNo': Number(t.data.comData.PageNo) + 1
    })
    if (t.data.comData.PageNo > t.data.comPage) {
      app.load.hide();
    } else {
      setTimeout(function () {

      }, 500)
      app.load.show();
      t.commission();
    }
  },
  parterLoad: function () {
    console.log(3333);
    t.setData({
      'parterData.PageNo': Number(t.data.parterData.PageNo) + 1
    })
    if (t.data.parterData.PageNo > t.data.parterPage) {
      app.load.hide();
    } else {
      setTimeout(function () {

      }, 500)
      app.load.show();
      t.parter();
    }
  },
  inv: function () {
    let t = this;
    if (!wx.getStorageSync('UserInfo').Phone) {
      t.msgShow('请绑定手机号', 1, function () {
        wx.navigateTo({
          url: '../bindNewPhone/bindNewPhone?from=partner'
        })
      })
    } else {
      t.setData({
        showMask: true
      })
      // if (t.data.center.Member.MemberType == '1') {
      //   t.setData({
      //     showMask: true
      //   })
      // } else {
      //   t.setData({
      //     showSuccess: true
      //   })
      // }
    }
  },
  wait: function () {
    let t = this;
    t.setData({
      showSuccess: false
    })
  },
  closeShow: function () {
    let t = this;
    t.setData({
      showMask: false,
      showSuccess: false
    })
  },
  // 向后台拿到二维码图片
  code: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/weixin/code',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: {
        Url: 'pages/index/index'
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.setData({
            code: res.Data
          })
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }
      }
    })
  },
  tiXian: function () {
    let t = this;
    console.log(wx.getStorageSync('UserInfo').Phone)
    if (!wx.getStorageSync('UserInfo').Phone) {
      t.msgShow('请绑定手机号', 1, function () {
        wx.navigateTo({
          url: '../bindNewPhone/bindNewPhone?from=partner'
        })
      })
    } else {
      wx.navigateTo({
        url: '../withdrawals/withdrawals'
      })
    }
  },
  partPlan: function () {
    let t = this;
    console.log(wx.getStorageSync('UserInfo').Phone)
    if (!wx.getStorageSync('UserInfo').Phone) {
      t.msgShow('请绑定手机号', 1, function () {
        wx.navigateTo({
          url: '../bindNewPhone/bindNewPhone?from=partner'
        })
      })
    } else {
      wx.navigateTo({
        url: '../partPlan/partPlan'
      })
    }
  },
  onShareAppMessage: function (res) {
    let t = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '千多利商城',
      path: '/pages/index/index?InvitationCode=' + t.data.InvitationCode,
      success: function (res) {
        t.msgShow('转发成功')
        // 转发成功
      },
      fail: function (res) {
        // t.msgShow('转发失败')
        // 转发失败
      }
    }
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
  }

})