// pages/serviceConfirm/serviceConfirm.js
let app = getApp();
app.load.show();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    id: '',
    date: '',
    hour: '',
    hourId: '',
    info: {},
    message: '',
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
      date: options.date.replace(/\//g, '-'),
      hour: options.hour,
      hourId: options.hourId
    })
    t.infoAjax();
  },
  infoAjax: function () {
    let t = this;
    wx.request({
      method: 'POST',
      url: t.data.config.api_url + '/api/v1/mall/service_ordercalculation',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: {
        ServiceGoodsId: t.data.id,
        AppointmentDate: t.data.date + ' 00:00:00',
        AppointmentTimeId: t.data.hourId
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
  message: function (e) {
    let t = this;
    t.setData({
      message: e.detail.value
    })
  },
  submit: function () {
    let t = this;
    wx.request({
      method: 'POST',
      url: t.data.config.api_url + '/api/v1/mall/service_order',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data:{
          RegionName:'',
          Tel:'',
          Memo: t.data.message,
          ServiceGoodsId: t.data.id,
          AppointmentTimeId: t.data.hourId,
          AppointmentDate: t.data.date + ' 00:00:00'
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          wx.navigateTo({
            url: '../pay/pay?id=' + res.Data.Id +'&type=2',
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