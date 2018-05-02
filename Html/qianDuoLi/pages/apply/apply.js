// pages/apply/apply.js
let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:app.config,
    fontSize:'0',
    oid:'',
    gid:'',
    RefundType:'',
    mp:'',
    reason:'',
    btn:false,
    type:'',   //1服务型
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    t.setData({
      gid: options.gid,
      oid: options.oid,
      RefundType: options.RefundType,
      mp: options.mp,
      type: options.type
    })
  },
  reason:function(e){
    let t=this;
    console.log(e);
    t.setData({
      reason: e.detail.value,
      fontSize:t.data.reason.length
    })
  },
  price:function(e){
    let t = this;
    console.log(e);
    t.setData({
      mp: e.detail.value
    })
  },
  servicesubmit:function(){
    let t = this;
    if (t.data.btn) {
      return false;
    }

    if (!t.data.mp) {
      t.msgShow('请输入退款金额', 1);
      return false;
    }
    if (!t.data.reason) {
      t.msgShow('请输入退款原因', 1);
      return false;
    }

    t.setData({
      btn: true
    })

    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/order/service_refund',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: {
        OrderId: t.data.oid,
        GoodsId: t.data.gid,
        RefundAmount: t.data.mp,
        Reason: t.data.reason
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.msgShow('提交成功', 1, function () {
            wx.redirectTo({
              url: '../apporderList/apporderList'
            })
          })
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  submit:function(){
    let t = this;
    if (t.data.btn){
      return false;
    }

    if (!t.data.mp){
      t.msgShow('请输入退款金额',1);
      return false;
    }
    if (!t.data.reason) {
      t.msgShow('请输入退款原因', 1);
      return false;
    }

    t.setData({
      btn:true
    })

    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/order/refund',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data:{
        OrderId:t.data.oid,
        SingleGoodsId: t.data.gid,
        RefundType: t.data.RefundType,
        RefundAmount:t.data.mp,
        Reason: t.data.reason
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.msgShow('提交成功',1,function(){
            wx.redirectTo({
              url: '../orderList/orderList'
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