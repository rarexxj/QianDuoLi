// pages/aftersales/aftersales.js
let app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    gid: '',
    oid:'',
    RefundType:'',
    mp:'',
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t=this;
    t.setData({
      gid: options.gid,
      oid: options.oid,
      RefundType: options.RefundType,
      mp: options.mp
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