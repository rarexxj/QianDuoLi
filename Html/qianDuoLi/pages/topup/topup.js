// pages/top/top.js
let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:app.config,
    info:{},
    choseBtn: '-1',
    price: '',
    alClick: false,
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
  price:function(){

  },
  choose: function (e) {
    let t = this;
    let index = e.currentTarget.dataset.index;
    console.log(e);
    console.log(t.data.info.List[index].Recharge)
    t.setData({
      choseBtn:index,
      price: t.data.info.List[index].Recharge
    })
  },
  info:function(){
    let t=this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/order/recharge_rule',
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
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  topUp: function () {
    var t = this;
    if (t.data.alClick) {
      return false;
    }
    if(!t.data.price){
      t.msgShow('请选择金额',1);
      return false;
    }
    t.setData({
      alClick:true
    })
    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/mall/balance_order',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data:{
        Money: t.data.price
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.submit(res);
          t.setData({
            alClick: false
          })
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  submit: function (res) {
    let t = this;
    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/payment/weixin/' + res.Data.Id + '?useBalance=0',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
            t.pay(res);
        }
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  },
  pay: function (res) {
    let t = this;
    wx.requestPayment({
      'timeStamp': res.Data.timeStamp,
      'nonceStr': res.Data.nonceStr,
      'package': res.Data.package,
      'signType': 'MD5',
      'paySign': res.Data.paySign,
      'success': function (res) {
        t.msgShow('支付成功', 1, function () {
          wx.reLaunch({
            url: '../center/center',
          })
        })
      },
      'fail': function (res) {
        t.msgShow('支付失败', 1, function () {
          wx.reLaunch({
            url: '../center/center',
          })
        })
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