// pages/pay/pay.js
let app = getApp();
app.load.show();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    id: '',
    min: '',
    seconds: '',
    info: {},
    cash: {},
    type: '',
    pay: '',
    yue:'',
    yueBtn: false,
    wxBtn: false,
    msgShow: false,
    msgTitle: '',
    payingBtn:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    console.log(options)
    t.setData({
      id: options.id,
      type: options.type
      // id:'7d40bb53-ba3b-44af-a4b8-22c1c146ce0d'
    })
    t.orderInfo();
    t.cash();
  },
  orderInfo: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/mall/order/' + t.data.id,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          var time = res.Data.CreateTime.replace(/\-/g, '/')
          time = new Date(time)
          time = time.getTime()
          var nowtime = new Date();
          res.Data.last = 30 * 60 - (1000 - (time - nowtime.getTime())) / 1000

          t.setData({
            info: res.Data,
            pay: res.Data.PayFee,
            min: parseInt(res.Data.last / 60),
            seconds: parseInt(res.Data.last % 60)
          })
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  cash: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/wallet/cash',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.setData({
            cash: res.Data,
            yue: res.Data.Available
          })
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  usecash: function () {
    let t = this;

    if (t.data.cash.Available == '0') {
      t.msgShow('余额不足', 1)
    } else {
      t.setData({
        yueBtn: !(t.data.yueBtn)
      })
      if (t.data.yueBtn) {
        t.setData({
          pay: Number(t.data.info.PayFee) - Number(t.data.cash.Available) < 0 ? '0' : Number(t.data.info.PayFee - t.data.cash.Available).toFixed(2)
        })
      } else {
        t.setData({
          pay: t.data.info.PayFee
        })
      }
    }
  },
  wxChoose: function () {
    let t = this;
    t.setData({
      wxBtn: !(t.data.wxBtn)
    })
  },
  submit: function () {
    let t = this;
    let useBanlance;
    if (t.data.payingBtn){
      return false;
    }
    if (!t.data.yueBtn && !t.data.wxBtn) {
      t.msgShow('请选择支付方式');
      return false;
    }
    if ((t.data.yue < t.data.info.PayFee) && !t.data.wxBtn){
        t.msgShow('余额不足,请选择微信支付');
        return false;
    }
    if (t.data.yueBtn ){
      useBanlance=1
    }else{
      useBanlance = 0
    }
    t.setData({
      payingBtn:true
    })
    console.log(t.data.yueBtn)
    console.log(t.data.wxBtn)
    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/payment/weixin/' + t.data.id + '?useBalance=' + useBanlance,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          if (res.Data.PayStatus==2){
            t.setData({
              payingBtn: false
            })
            t.msgShow('支付成功', 1, function () {
              wx.reLaunch({
                url: '../center/center',
              })
            })
          }else{
            t.pay(res);
          }
        }
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  },
  pay:function(res){
    let t=this;
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

          wx.request({
            method: 'POST',
            url: t.data.config.api_url + 'api/v1/payment/cancelpay/'+ t.data.id,
            header: {
              'content-type': 'application/json', // 默认值
              'Authorization': wx.getStorageSync('Token')
            },
            success: function (res) {
              res = res.data;
              if (res.ReturnCode == '200') {
                wx.reLaunch({
                  url: '../center/center',
                })
              }
            },
            fail: function (res) {
              console.log(res.data)
            }
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