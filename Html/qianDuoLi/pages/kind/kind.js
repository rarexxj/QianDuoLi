// pages/kind/kind.js
let app = getApp();
app.load.show();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    info: [],

    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    app.checkLogin();
    t.infoAjax();
  },
  infoAjax: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/mall/goods_category',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.setData({
            info: res.Data
          })
          app.load.hide();
        }
      },
      fail: function (res) {
        t.msgShow(res.Msg)
      }
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
    let t = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '千多利商城',
      path: '/pages/kind/kind',
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