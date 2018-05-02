// pages/address/address.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    info: [],
    id:'',
    gid:'',
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    console.log(options)
    t.setData({
      id: options.id,
      gid:options.gid
    })
    t.addressInfo();
  },
  addressInfo: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/member/address',
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
  chooseAddress:function(e){
    let t=this;
    var addid = e.currentTarget.dataset.addid;
    if (t.data.id) {
      wx.redirectTo({
        url: '../confirm/confirm?id=' + t.data.id + '&addid=' + addid,
      })
    } else if (t.data.gid) {
      wx.redirectTo({
        url: '../confirm/confirm?gid=' + t.data.gid +'&addid=' + addid,
      })
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