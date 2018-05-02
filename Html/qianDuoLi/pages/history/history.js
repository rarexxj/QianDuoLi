// pages/history/history.js
let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:app.config,
    datas:{
      pageNo:1,
      limit:6
    },
    allPage:'',
    info:[],
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t=this;
    app.load.show();
    t.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  init: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/mall/browse',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data:t.data.datas,
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.data.allPage = Math.ceil(res.Data.Count / t.data.datas.limit)
          t.setData({
            info:t.data.info.concat(res.Data.Goods)
          })
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }
      }
    })
  },
  upload:function(){
    let t = this;
    console.log(3333);
    t.setData({
      'datas.pageNo': Number(t.data.datas.pageNo) + 1
    })
    console.log(t.data.allPage)
    if (t.data.datas.pageNo > t.data.allPage) {
      return false;
    } else {
      setTimeout(function () {

      }, 500)
      app.load.show();
      t.init();
    }
  },
  del: function () {
    let t = this;
    wx.request({
      method: 'DELETE',
      url: t.data.config.api_url + 'api/v1/mall/browse',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          app.load.hide();
          t.msgShow('成功清理记录',1,function(){
            wx.reLaunch({
              url: '../center/center'
            })
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