// pages/orderInfo/orderInfo.js
let app=getApp();
app.load.show();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:app.config,
    id:'',
    info:{},
    msgShow: false,
    msgTitle: ''
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t=this;
    t.setData({
      id:options.id
    })
    t.orderInfo();
  },
  orderInfo: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/mall/order/'+t.data.id,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          
          if (res.Data.OrderStatus == 0) {
            var str = res.Data.CreateTime.split('T');
            str = str.toString().replace(/-/g, "/");
            var date = new Date(str);
            var deadline = date.getTime() + 30 * 60 * 1000;
            var mytime = new Date()
            var nowtime = mytime.getTime();
            var last = (deadline - nowtime) / 1000;
            res.Data.paymin = parseInt(last / 60);
            res.Data.paysec = parseInt(last % 60);
            if (res.Data.paymin < 10) {
              res.Data.paymin = '0' + res.Data.paymin
            }
            if (res.Data.paysec < 10) {
              res.Data.paysec = '0' + res.Data.paysec
            }
          }
          //计算剩余确认收货时间
          if (res.Data.OrderStatus == 2) {
            var str = res.Data.ShippingTime.split('T');
            str = str.toString().replace(/-/g, "/");
            var date = new Date(str);
            var deadline = date.getTime() + 14 * 24 * 60 * 60 * 1000;
            var mytime = new Date()
            var nowtime = mytime.getTime();
            var last = (deadline - nowtime) / 1000;
            res.Data.conday = parseInt(last / 60 / 60 / 24)
            res.Data.conhour = parseInt((last - res.Data.conday * 24 * 60 * 60) / 60 / 60)
          }
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
  del: function (e) {
    let t = this;
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '是否删除订单?',
      confirmColor: '#5BB3FF',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            method: 'DELETE',
            url: t.data.config.api_url + 'api/v1/order/' + id,
            header: {
              'content-type': 'application/json', // 默认值
              'Authorization': wx.getStorageSync('Token')
            },
            success: function (res) {
              res = res.data;
              if (res.ReturnCode == '200') {
                app.load.hide();

                t.msgShow('成功删除订单', 1, function () {
                  t.data.info.splice(index, 1)
                  t.setData({
                    info: t.data.info
                  })
                })

              } else {
                t.msgShow(res.Msg)
              }

            }
          })

        } else {

        }
      }
    })
  },
  sureGet: function (e) {
    let t = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否确认订单?',
      confirmColor: '#5BB3FF',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            method: 'PUT',
            url: t.data.config.api_url + 'api/v1/order/' + id + '/complete',
            header: {
              'content-type': 'application/json', // 默认值
              'Authorization': wx.getStorageSync('Token')
            },
            success: function (res) {
              res = res.data;
              if (res.ReturnCode == '200') {
                t.msgShow('成功确认收货', 1, function () {
                  wx.redirectTo({
                    url: '../orderList/orderList'
                  })
                })

              } else {
                t.msgShow(res.Msg)
              }

            }
          })

        } else {

        }
      }
    })
  },
  tx: function (e) {
    let t = this;
    let id = e.currentTarget.dataset.id;
    wx.request({
      method: 'post',
      url: t.data.config.api_url + 'api/v1/order/' + id + '/remind',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.msgShow('提醒成功', 1, function () {

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