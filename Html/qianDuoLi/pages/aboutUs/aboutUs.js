// pages/aboutUs/aboutUs.js
let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t=this;
    t.ajax();
  },
  ajax: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/page/01',
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
  }
})