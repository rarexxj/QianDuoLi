// pages/withdrawals/withdrawals.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    price: '',
    layBtn: false,
    maxPrice: '',
    duanxCode: '',
    name: '',
    account: '',
    array: ['请选择', '微信', '支付宝'],
    codeDis: false,
    phoneCode: "获取验证码",
    index:0,
    duanxCode:'',
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    t.myWallet();

  },
  price:function(e){
    let t=this;
    t.setData({
      price:e.detail.value
    })
  },
  name:function(e){
    let t = this;
    t.setData({
      name: e.detail.value
    })
  },
  account:function(e){
    let t = this;
    t.setData({
      account: e.detail.value
    })
  },
  myWallet: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/wallet/commission',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {


          t.setData({
            maxPrice: res.Data.Available
          })

          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  next: function () {
    let t = this;
    if (t.data.price) {
      if (Number(t.data.price) > Number(t.data.maxPrice)) {
        t.msgShow('提现金额超出范围', 1)
        return false;
      } else if (t.data.price <= 0) {
        t.msgShow('请输入正确的提现金额', 1)
        return false;
      }
    } else {
      t.msgShow('请输入提现金额', 1);
      return false;
    }
    if (t.data.index==0) {
      t.msgShow('请选择提现方式', 1);
      return false;
    }
    if (!t.data.name) {
      t.msgShow('请输入姓名', 1);
      return false;
    }
    if (!t.data.account) {
      t.msgShow('请输入账号', 1);
      return false;
    }
    t.setData({
      layBtn:true
    })
    // t.data.layBtn = true;
  },
  get2() {
    let t = this;
    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/wallet/sendcode',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: {
        Phone: wx.getStorageSync('UserInfo').Phone
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.msgShow('验证码发送成功', 1, function () {
            t.setData({
              codeDis: true
            })

            // ajax
            t.setData({
              phoneCode: 60
            })
            let time = setInterval(() => {
              t.data.phoneCode--
              t.setData({
                phoneCode: t.data.phoneCode
              })

              if (t.data.phoneCode == 0) {
                clearInterval(time)
                t.setData({
                  phoneCode: "获取验证码",
                  codeDis: false
                })
              }
            }, 1000)
          })
        } else {
          t.msgShow(res.Msg)
        }
      }
    })
  },
  duanxCode:function(e){
    let t=this;
    t.setData({
      duanxCode:e.detail.value
    })
  },
  tixian: function () {
    let t = this;
    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/wallet',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: {
        Account: t.data.account,//账号
        RealName: t.data.name,//提款人姓名
        PaymentType: Number(t.data.index)+1,
        Money: t.data.price,//金额
        SmsVerifyCode: t.data.duanxCode
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.msgShow('申请已提交,待审核', 1, function () {
            wx.switchTab({
              url: '../center/center'
            })
          })
        } else {
          t.msgShow(res.Msg)
        }
      }
    })
    
  },
  changeType: function (e) {
    let t = this;
    t.setData({
      index: e.detail.value
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