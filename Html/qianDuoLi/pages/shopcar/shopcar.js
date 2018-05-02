// pages/shopcar/shopcar.js
let app = getApp();
app.load.show();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    Carts:[],
    editcartsta: false,
    pchoose: false,
    len: 0,
    all: 0,
    allChoose: false,
    editData:{
      CartId:'',
      Quantity:''
    },
    msgShow: false,
    msgTitle: '',
    loadT: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    let loadT = this.data.loadT;

    app.checkUser(function () {
      app.load.show();
      t.init();
    });

    this.setData({
      loadT: 1
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    let t = this;
    let loadT = this.data.loadT;

    loadT++;
    this.setData({
      loadT: loadT
    });

    if (loadT > 2) {
      t.init();
    }
    
  },

  init: function () {
    var t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/mall/cart',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          for (var i = 0; i < res.Data.Carts.length; i++) {
            var obj = res.Data.Carts[i];
            res.Data.Carts[i].shuxin = obj.GoodsAttribute.split(',') || [];
            res.Data.Carts[i].choose = false;
            res.Data.Carts[i].showBox = false;
            t.setData({
              Carts: res.Data.Carts
            })
          }
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }
      }
    })
  },
  allChoose: function (e) {
    let t = this;
    let btn = !(t.data.allChoose);
    if (btn) {
      for (var i = 0; i < t.data.Carts.length; i++) {
        let obj = t.data.Carts[i];
        obj.choose = true
        // t.len++
        // t.all+=obj.Price
      }
    } else {
      for (var i = 0; i < t.data.Carts.length; i++) {
        let obj = t.data.Carts[i];
        obj.choose = false
        // t.len--
        // t.all-=obj.Price
      }
    }
    t.setData({
      allChoose: btn,
      Carts: t.data.Carts
    })
    this.count();


  },

  choose: function (e) {
    let t = this;
    let index = e.currentTarget.dataset.index;
    if (t.data.Carts[index].choose) {
      t.data.Carts[index].choose = false
    } else {
      t.data.Carts[index].choose = true
    }
    t.setData({
      Carts: t.data.Carts
    })
    t.count();
  },
  jian: function (e) {
    let t = this;
    let index = e.currentTarget.dataset.index;
    t.data.Carts[index].Quantity--
    if (t.data.Carts[index].Quantity < 1) {
      t.data.Carts[index].Quantity = 1
    }
    t.setData({
      Carts: t.data.Carts
    })

  },
  add: function (e) {
    let t = this;
    let index = e.currentTarget.dataset.index;
    t.data.Carts[index].Quantity++
    t.setData({
      Carts: t.data.Carts
    })
  },
  count: function () {
    let t=this;
    let money = 0;
    let num = 0;
    for (var i in t.data.Carts) {
      var datas = t.data.Carts[i];
      if (datas.choose) {
        money = Number(money) + Number(datas.Price * datas.Quantity);
        num = Number(num) + Number(datas.Quantity);
      }
    }
    t.setData({
      all :money,
      len : num
    })
  },
  edit: function (e) {
    let t = this;
    let index = e.currentTarget.dataset.index;
    let num = t.data.Carts[index].Quantity;
    t.data.Carts[index].showBox = !(t.data.Carts[index].showBox);
    t.setData({
      Carts: t.data.Carts
    })


  },
  editCarts: function (e) {
    let t = this;
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let num=t.data.Carts[index].Quantity;
    if (t.data.editcartsta) {
      return false
    }
    t.setData({
      editcartsta:true
    })
    wx.request({
      method: 'PUT',
      url: t.data.config.api_url + 'api/v1/mall/cart',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: {
        CartId:id,
        Quantity:num
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.data.Carts[index].showBox = false;
          t.count();
          t.setData({
            Carts: t.data.Carts,
            editcartsta: false
          })
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }
      },
      fail:function(res){
        console.log(res)
      }
    })  
  },
  clearsc: function () {
    let t = this;
    wx.request({
      method: 'DELETE',
      url: t.data.config.api_url + 'api/v1/mall/cart/clear',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          app.load.hide();
          t.msgShow('清除成功', 1, function () {
            wx.reLaunch({
              url: '../shopcar/shopcar',
            })
            // t.init();
            // t.setData({
            //   allChoose:false,
            //   all:0
            // })
          })
        } else {
          t.msgShow(res.Msg)
        }
      }
    }) 

  },

  del: function (e) {
    let t = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      confirmColor: '#5BB3FF',
      success: function (res) {
        if (res.confirm) {

          wx.request({
            method: 'DELETE',
            url: t.data.config.api_url + 'api/v1/mall/cart/'+id,
            header: {
              'content-type': 'application/json', // 默认值
              'Authorization': wx.getStorageSync('Token')
            },
            success: function (res) {
              res = res.data;
              if (res.ReturnCode == '200') {
                app.load.hide();
                t.msgShow('删除成功', 1, function () {
                  wx.reLaunch({
                    url: '../shopcar/shopcar',
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
  submit: function () {
    let ids = '',
      t = this,
      num=[]
    for (var i = 0; i < t.data.Carts.length; i++) {
      var obj = t.data.Carts[i];
      if (obj.choose) {
        num.push(Number(obj.choose))
        if(num.length==1){
          ids=ids;
        }else{
          ids += '|'
        }
        ids += obj.Id
      }
    }
    if (!ids) {
      t.msgShow('请先选择商品',1)
      return false
    }

    
    wx.navigateTo({
      url: '../confirm/confirm?id=' + ids,
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