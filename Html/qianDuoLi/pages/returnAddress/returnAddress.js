// pages/returnAddress/returnAddress.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:app.config,
    id:'',
    name:'',
    reason:'',
    fontSize:'',
    orderNum:'',
    btn:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t=this;
    t.setData({
      id:options.id
    })
    app.load.hide();
  },
  orderNum:function(e){
    let t = this;
    console.log(e);
    t.setData({
      orderNum: e.detail.value
    })
  },
  reason: function (e) {
    let t = this;
    console.log(e);
    t.setData({
      reason: e.detail.value,
      fontSize: t.data.reason.length
    })
  },
  name: function (e) {
    let t = this;
    console.log(e);
    t.setData({
      name: e.detail.value
    })
  },
  submit:function(){
    let t = this;
    if (t.data.btn) {
      return false;
    }

    if (!t.data.name) {
      t.msgShow('请输入物流公司', 1);
      return false;
    }
    if (!t.data.orderNum) {
      t.msgShow('请输入物流单号', 1);
      return false;
    }
    if (!t.data.reason) {
      t.msgShow('请输入退款说明', 1);
      return false;
    }

    t.setData({
      btn: true
    })

    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/order/refundlogistics',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: {
        Id: t.data.id,
        ShippingName: t.data.name,
        ShippingNo: t.data.orderNum,
        ShippingMemo: t.data.reason
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.msgShow('提交成功', 1, function () {
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