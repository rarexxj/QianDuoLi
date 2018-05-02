// pages/logistics/logistics.js
let app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    config:app.config,
    data:{},
    info:{},
    orderInfo:{},
    id:'',
    length:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t=this;
    t.setData({
      data:{
        ExpressName:options.code,
        ExpressNum: options.num,
        FromAddress:'',
        ToAddress:''
      },
      id:options.id
    })
    t.infoAjax();
    t.orderInfo()
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
          t.setData({
            orderInfo: res.Data
          })

          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  infoAjax: function () {
    let t = this;
    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/order/express',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: t.data.data,
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          for(var i=0;i<res.Data.List.length;i++){
            res.Data.List[i].date = res.Data.List[i].Time.split(' ')[0];
            res.Data.List[i].hour = res.Data.List[i].Time.split(' ')[1];
          }
          t.setData({
            info: res.Data.List,
            length: res.Data.List.length
          })
          console.log(t.data.length)
          app.load.hide();
        }
      },
      fail: function (res) {
        res = res.data;
        t.msgShow(res.Msg)
      }
    })
  }
})