// pages/orderList/orderList.js
let app = getApp();
app.load.show();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    curIndex: '0',
    info: [],
    orderType: [
      {
        id: 0,
        name: '全部'
      },
      {
        id: 1,
        name: '待付款'
      },
      {
        id: 2,
        name: '待收货'
      },
      {
        id: 3,
        name: '待评价'
      }
    ],
    data: {
      PageNo: '1',
      OrderType: 0,
      Limit: '5'
    },
    flag:true,
    allPage: '',
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    if (options.type) {
      t.setData({
        'data.OrderType': options.type,
        curIndex: options.type
      })
    }
    t.orderList();
  },
  navClick(e) {
    let t = this;
    t.setData({
      curIndex: e.currentTarget.dataset.index,
      'data.PageNo': 1,
      'data.OrderType': e.currentTarget.dataset.index
    })
    t.orderList();
  },
  orderList: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/mall/order',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: t.data.data,
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.data.allPage = Math.ceil(res.Data.Count / t.data.data.Limit)
          t.setData({
            allPage: t.data.allPage,
            info: res.Data.Orders
          })
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  loadAjax: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/mall/order',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: t.data.data,
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.setData({
            info: t.data.info.concat(res.Data.Orders)
          })
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  upload: function () {
    let t = this;
    if(t.data.flag==true){
      t.setData({
        'data.PageNo': Number(t.data.data.PageNo) + 1,
        flag: false
      })
      if (t.data.data.PageNo > t.data.allPage) {
        app.load.hide();
      } else {
        setTimeout(function () {
          t.setData({
            flag: true
          })
        }, 500)
        app.load.show();
        t.loadAjax();
      }
    }
    

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
    var index = e.currentTarget.dataset.index;
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
                app.load.hide();
                t.data.info[index].OrderStatus = 3;
                t.setData({
                  info: t.data.info
                })
                t.msgShow('成功确认收货', 1, function () {

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
      method: 'POST',
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
  afterInfo:function(e){
    let t=this;
    wx.navigateTo({
      url: '../afterInfo/afterInfo?oid=' + e.currentTarget.dataset.oid + '&gid=' + e.currentTarget.dataset.gid
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