// pages/wallet/wallet.js
let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:app.config,
    wallet:{},
    comData: {
      PageNo: 1,
      Limit: 10
    },
    comPage: '',
    comInfo: [],
    flag:true,
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t=this;
    t.myWallet();
    t.commission();
  },
  myWallet:function(){
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
            wallet: res.Data
          })

          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  commission: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/walletbill',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: t.data.comData,
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.setData({
            comPage: Math.ceil(res.Data.Count / t.data.comData.Limit),
            comInfo: t.data.comInfo.concat(res.Data.Bills)
          })
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }
      }
    })

  },
  comLoad: function () {
    console.log(3333);
    let t=this;
    if (t.data.flag == true) {
      t.setData({
        'comData.PageNo': Number(t.data.comData.PageNo) + 1,
        flag:false
      })
      console.log(t.data.comData.PageNo)
      console.log(t.data.comPage)
      if (t.data.comData.PageNo > t.data.comPage) {
        app.load.hide();
      } else {
        setTimeout(function () {
          t.setData({
            flag:true
          })
        }, 500)
        app.load.show();
        t.commission();
      }
    }
    
  },
  topUp:function(){
    let t=this;
    console.log(wx.getStorageSync('UserInfo').Phone)
    if(!wx.getStorageSync('UserInfo').Phone){
      t.msgShow('请绑定手机号',1,function(){
        wx.navigateTo({
          url: '../bindNewPhone/bindNewPhone?from=wallet'
        })
      })
    }else{
      wx.navigateTo({
        url: '../topup/topup'
      })
    }
  },
  tiXian:function(){
    let t = this;
    console.log(wx.getStorageSync('UserInfo').Phone)
    if (!wx.getStorageSync('UserInfo').Phone) {
      t.msgShow('请绑定手机号', 1, function () {
        wx.navigateTo({
          url: '../bindNewPhone/bindNewPhone?from=wallet'
        })
      })
    } else {
      wx.navigateTo({
        url: '../withdrawals/withdrawals'
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