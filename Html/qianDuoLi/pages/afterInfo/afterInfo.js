// pages/afterInfo/afterInfo.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    oid: '',
    gid: '',
    info: {},
    type: '',
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    t.setData({
      oid: options.oid,
      gid: options.gid,
      type: options.type
    })
    t.info();
  },
  info: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/order/refund',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: {
        OrderId: t.data.oid,
        SingleGoodsId: t.data.gid
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.setData({
            info: res.Data
          })
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  canBtn: function (e) {
    let t = this;
    wx.request({
      method: 'DELETE',
      url: t.data.config.api_url + 'api/v1/order/refund/' + e.currentTarget.dataset.id,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.msgShow('退款撤销成功', 1, function () {
            if (t.data.type == 1) {
              wx.redirectTo({
                url: '../apporderList/apporderList'
              })
            } else {
              wx.redirectTo({
                url: '../orderList/orderList'
              })
            }
          })
        } else {
          t.msgShow(res.Msg)
        }
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
  }

})