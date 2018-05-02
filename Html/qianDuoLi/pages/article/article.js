// pages/article/article.js
let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:app.config,
    infoData:{
      PageNo:1,
      Limit:10
    },
    info:[],
    allpage:'',
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t=this;
    t.info();
  },
  info:function(){
    let t=this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/article',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: t.data.infoData,
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {

          t.data.allPage = Math.ceil(res.Data.Count / t.data.infoData.Limit)
          t.setData({
            info: t.data.info.concat(res.Data.ArticleList),
            allPage: t.data.allPage
          })
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  upLoad:function(){
    let t = this;
    t.setData({
      'infoData.PageNo': Number(t.data.infoData.PageNo) + 1
    })
    if (t.data.infoData.PageNo > t.data.allPage) {
      app.load.hide();
    } else {
      setTimeout(function () {

      }, 500)
      app.load.show();
      t.info();
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