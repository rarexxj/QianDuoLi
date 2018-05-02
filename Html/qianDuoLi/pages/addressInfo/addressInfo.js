// pages/addressInfo/addressInfo.js
let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:app.config,
    id:'',  //地址id
    ind:{},
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t=this;
    console.log(options)
    t.setData({
      id: options.id
    })

    t.info()
  },
  info:function(){
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/member/address/'+t.data.id,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
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
  dels:function(){
    let t = this;
    wx.request({
      method: 'DELETE',
      url: t.data.config.api_url + 'api/v1/member/address/' + t.data.id,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
        t.msgShow('成功删除地址', 1, function () {
            wx.navigateBack({
              delta: 2
            })
          })  
        } else {
          t.msgShow(res.Msg)
        }
      }
    })
  },
  setdef:function(){
    let t = this;
    wx.request({
      method: 'PUT',
      url: t.data.config.api_url + 'api/v1/member/address/' + t.data.id+'/default',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.msgShow('设为默认地址',1,function(){
            wx.navigateBack({
              delta: 2
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