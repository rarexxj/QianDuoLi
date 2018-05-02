// pages/confirm/confirm.js
let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:app.config,
    diya:'',
    id: '',
    gid: '',
    addid: '',
    ids:{
      // IsFromCart: false,
      // AddressId: '',
      // CartIds: '',
      // SingleGoods: {
      //   SingleGoodsId: '',
      //   Quantity: 1
      // }
    },
    info:{},
    substa:false,
    message:'',
    allprice:'0',
    submitData:{
      Consignee: '',
      Province: '',
      City:'',
      District: '',
      Street: '',
      RegionName:'',
      Address: '',
      Tel: '',
      Memo: '',
      Goods:'',
      Integral: ''
    },
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t=this;
    t.setData({
      gid: options.gid,
      id:options.id,
      addid: options.addid
    })
    if (t.data.id) {
      if (t.data.id.indexOf('|') > 0) {
        console.log(8888)
        t.data.ids.CartIds = t.data.id.split('|')
      } else {
        t.data.ids.CartIds=[];
        t.data.ids.CartIds.push(t.data.id)
        console.log(typeof t.data.ids.CartIds)
      }

      t.data.ids.IsFromCart = true
    }

    if (t.data.gid) {
      t.data.ids.SingleGoods = [];
      var a = {}
      a.SingleGoodsId = t.data.gid.split('|')[0];
      a.Quantity = t.data.gid.split('|')[1];
      t.data.ids.SingleGoods.push(a)
      t.data.ids.IsFromCart = false
    }

    if (t.data.addid) {
      t.data.ids.AddressId = t.data.addid
    }

    t.setData({
      ids:t.data.ids
    })
    t.init();
  },
  switchChange: function (e) {
    let t=this;
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    if (e.detail.value) {
      t.data.allprice = t.data.allprice - t.data.info.AvailableIntegral * t.data.info.IntegralDiscountRate / 100
      t.setData({
        'submitData.Integral': t.data.info.AvailableIntegral
      })
      if (t.data.allprice < 0) {
        t.data.allprice = 0
      }
    } else {
      t.data.allprice = t.data.info.ShippingFee + t.data.info.GoodsAmount
    }
    t.setData({
      allprice: t.data.allprice
    })
  },
  init: function () {
    let t = this;
    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/mall/ordercalculation',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: t.data.ids,
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          var prodata = []
          for (var i = 0; i < res.Data.Goods.List.length; i++) {
            var pro = {}
            pro.Id = res.Data.Goods.List[i].SingleGoodsId;
            pro.Quantity = res.Data.Goods.List[i].Quantity;
            prodata.push(pro)
          }
          t.setData({
            info: res.Data,
            allprice: res.Data.ShippingFee + res.Data.GoodsAmount,
            diya: (res.Data.AvailableIntegral / 100 * res.Data.IntegralDiscountRate).toFixed(2)
          })

          if (t.data.info.Addresses){
            t.setData({
              submitData: {
                Consignee: res.Data.Addresses.Contacts,
                Province: res.Data.Addresses.Province,
                City: res.Data.Addresses.City,
                District: res.Data.Addresses.District,
                Street: res.Data.Addresses.Street,
                RegionName: res.Data.Addresses.RegionName,
                Address: res.Data.Addresses.Address,
                Tel: res.Data.Addresses.Phone,
                Goods: prodata,
              }
            })
            
          }else{
            t.setData({
              submitData: {
                Consignee: '',
                Province:'',
                City: '',
                District: '',
                Street: '',
                RegionName: '',
                Address: '',
                Tel: '',
                Goods: prodata,
              }
            })
          }
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  message:function(e){
    let t=this;
    t.setData({
      'submitData.Memo':e.detail.value
    })
  },
  toaddr: function () {
    let t=this;
    //选择地址
    if (t.data.id) {
      wx.navigateTo({
        url: '../chooseAddress/chooseAddress?id='+t.data.id,
      })
      
    } else {
      wx.navigateTo({
        url: '../chooseAddress/chooseAddress?gid=' + t.data.gid,
      })
    }
  },
  topro: function (id) {
    wx.navigateTo({
      url: '../productsInfo/productsInfo?id=' + t.data.id,
    })
  },
  submit: function () {
    let t = this;
    if (t.data.substa) {
      console.log(3333)
      return false
    }
    if (!t.data.info.Addresses) {
      t.msgShow('请选择收货地址', 1)
      return false
    }
    t.substa = true
    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/mall/order',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: t.data.submitData,
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          // if (res.Data.PayFee == 0) {
          //   wx.navigateTo({
          //     url: '../order/order?id=' + res.Data.Id
          //   })
          //   return false
          // }
          wx.navigateTo({
            url: '../pay/pay?id=' + res.Data.Id
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