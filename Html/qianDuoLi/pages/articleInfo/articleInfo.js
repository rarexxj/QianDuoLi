// pages/articleInfo/articleInfo.js
let app = getApp();
app.load.show();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    info: {},
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
    t.info();
  },
  info:function(){
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/article/'+t.data.id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          res.Data.Content = res.Data.Content.replace(/<img src="\//g, '<img style="width:100% !important" src="' + t.data.config.api_url + '/')
          res.Data.Content=res.Data.Content.replace(/<img/g,'<img style="width:100% !important"')
          
          t.setData({
            info: res.Data
          })
          console.log(t.data.info)
          app.load.hide();
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
    })

    clearTimeout(_this.timeBox)
    _this.timeBox = setTimeout(() => {
      _this.setData({
        msgShow: false
      })

      if (typeof (callback) == 'function') {
        callback()
      } else {

      }
    }, (time ? time : 1) * 2000)
  }
})