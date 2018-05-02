// pages/partPlan/partPlan.js
let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:app.config,
    id:'',
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t=this;
    t.setData({
      id:options.id
    })
    t.ajax();
  },

  ajax: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/page/05',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          res.Data.Content = res.Data.Content.replace(/<img src="\//g, '<img style="width:100% !important" src="' + t.data.config.api_url + '/')
          t.setData({
            info: res.Data
          })
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }
      }
    })
  },
  onShareAppMessage: function (res) {
    let t=this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '千多利商城',
      path: '/pages/index/index?InvitationCode=' + wx.getStorageSync('UserInfo').InvitationCode,
      imageUrl: t.data.config.static_url+'ico2.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
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