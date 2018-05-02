// pages/productsInfo/productsInfo.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    navIndex: '1',
    csize: false,
    attr: {},
    id: '',  //商品id
    info: {},
    attrbuite: [],
    guige: {},
    attr: {},

    guiges: [],
    evaluatesData: {
      GoodsId: '',
      PageNo: 1,
      Limit: 5
    },
    evaluateInfo: [],
    num: '1',
    addcartbol: false,
    buybol: false,
    guigBtn:false,
    allPage: '',
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    app.checkLogin();    
    app.load.show();
    t.setData({
      id: options.id,
      // id:'456da74e-b046-46ca-adf3-62516ce339d7',
      // 'evaluatesData.GoodsId': '456da74e-b046-46ca-adf3-62516ce339d7'
      'evaluatesData.GoodsId': options.id

    })
    t.infoAjax();
    if (wx.getStorageSync('Token')) {
      t.browse();
    }



  },
  browse: function () {
    let t = this;

    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/mall/browse/' + t.data.id,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {

        } else {
          t.msgShow(res.Msg)
        }
      }
    })
  },
  infoAjax: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/mall/goods/' + t.data.id,
      header: wx.getStorageSync('Token')?{
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      }:{
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          res.Data.Description = res.Data.Description.replace(/<img src="\//g, '<img style="width:100% !important" src="' + t.data.config.api_url + '/')

          res.Data.Description = res.Data.Description.replace(/<img/g, '<img style="width:100% !important"')
          // console.log(res.Data.Description)
          t.setData({
            info: res.Data,
            guige: res.Data,
            'guige.Image': res.Data.Image[0]
          })

          //单品规格循环
          for (var i = 0; i < t.data.info.Attributes.length; i++) {
            var a = t.data.info.Attributes[i].list = {};
            var id = t.data.info.Attributes[i].AttributeId;
            var shuxins = t.data.info.Attributes[i].AttributeValues.split(',');
            if (shuxins.length) {
              var list = []
              for (var j = 0; j < shuxins.length; j++) {
                var aaaa = {
                  val: shuxins[j],
                  btn: false
                }
                list.push(aaaa);
              }
              var json = {};
              json.id = id;
              json.name = t.data.info.Attributes[i].AttributeName;
              json.list = list;
              t.data.attrbuite.push(json);
              console.log(t.data.attrbuite);
              t.setData({
                attrbuite: t.data.attrbuite
              })
            }
            console.log(t.data.attrbuite)
          }
          t.setAttr();
          t.evaluateAjax();
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  evaluateAjax: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/mall/goods_evaluates',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: t.data.evaluatesData,
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.data.allPage = Math.ceil(res.Data.Count / t.data.evaluatesData.Limit)
          t.setData({
            evaluateInfo: t.data.evaluateInfo.concat(res.Data.Evaluates)
          })
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }
      }
    })
  },
  //导航点击
  navClick: function (e) {
    let t = this;
    t.setData({
      navIndex: e.currentTarget.dataset.index
    })
  },
  //规格弹窗
  csize: function () {
    let t = this;
    let csize = !(t.data.csize);
    let guigBtn = !(t.data.guigBtn);
    t.setData({
      csize: csize,
      guigBtn: guigBtn,
      addcartbol: false,
      buybol: false
    })

    console.log(t.data.guigBtn)
  },
  setAttr: function () {
    let t = this;
    for (var i = 0; i < t.data.info.SingleGoogs.length; i++) {
      var obj = t.data.info.SingleGoogs[i];
      var key = ''
      for (var j = 0; j < obj.Attributes.length; j++) {
        var obj1 = obj.Attributes[j];
        key += obj1.AttributeId + ':' + obj1.AttributeValue + '|'

      }
      t.data.attr[key] = obj;
      t.setData({
        attr: t.data.attr
      })
    }
  },
  choose: function (e) {
    let id = e.currentTarget.dataset.attributeid;
    let attr = e.currentTarget.dataset.value;
    let index = e.currentTarget.dataset.index;
    let btn = e.currentTarget.dataset.choosebtn;
    let btns = e.currentTarget.dataset.indexs;
    console.log(btns)
    // if(btns=='1'){
    //   return false;
    // }
    let t = this;
    console.log(t.data.attrbuite)
    for (var i in t.data.attrbuite[btns].list) {
      t.data.attrbuite[btns].list[i].btn = false
    }

    t.data.attrbuite[btns].list[index].btn = true
    console.log(attr)
    var keys = id + ':' + attr + '|';

    t.data.guiges[btns] = keys;

    console.log(t.data.guiges)
    console.log(t.data.guiges[id])
    var key = ''
    for (var i in t.data.guiges) {

      key += t.data.guiges[i];

    }
    console.log(key)
    if (t.data.attr[key]) {
      t.data.guige = t.data.attr[key];
      // t.setData({
      //   buybol:true
      // })
      console.log(t.data.guige)
    } else {
      t.data.guige = t.data.info;
      t.data.guige.Stock = 0;
      t.data.guige.Image = t.data.info.Image[0] ? t.data.info.Image[0] : '';
    }

    t.setData({
      attrbuite: t.data.attrbuite,
      guige: t.data.guige
    })

  },
  num: function () {
    let t = this;


  },
  // 加
  add: function () {
    let t = this;
    if (t.data.guige.Stock != 0) {
      t.setData({
        num: Number(t.data.num) + 1
      })
    }
  },
  // 减
  jian: function () {
    let t = this
    if (t.data.guige.Stock != 0) {
      if (t.data.num > 1) {
        t.setData({
          num: Number(t.data.num) - 1
        })
      }
    }
  },
  closeLayer:function(){
    let t=this;
    t.setData({
      csize: false,
      guigBtn: false,
      addcartbol: false,
      buybol: false
    })
  },
  towhere: function () {
    let t = this;
    console.log(t.data.guigBtn)
    if (t.data.guige.Stock==0) {
      // t.setData({
      //   csize: false
      // })

      t.msgShow('库存不足', 1)
      return false;
    }
    
    if (!t.data.guige.SingleGoodsId) {
      t.msgShow('请选择规格',1)
      return false;
    }
    if (t.data.guigBtn){
      t.setData({
        csize: false,
        guigBtn:false
      })
      return false;
    }
    if (t.data.addcartbol) {
      t.addcart()
      return false;
    }
    if (t.data.buybol) {
      t.buy()
      return false;
    }
  },
  //立即购买
  buy: function () {
    let t = this
    if (!(t.data.guige.SingleGoodsId)) {
      t.setData({
        csize: true,
        guigBtn:false,
        addcartbol: false,
        buybol: true
      })
    } else {
      wx.navigateTo({
        url: '../confirm/confirm?gid=' + t.data.guige.SingleGoodsId + "|" + t.data.num
      })
    }
    console.log(t.data.guigBtn)
  },
  //加入购物车
  addcart: function () {
    var t = this
    if (!(t.data.guige.SingleGoodsId)) {

      t.setData({
        csize: true,
        guigBtn:false,
        addcartbol: true,
        buybol: false
      })
      console.log(t.data.guigBtn)
    } else {
      var listdata = {
        GoodsId: t.data.id,
        SingleGoodsId: t.data.guige.SingleGoodsId,
        Quantity: t.data.num
      }
      wx.request({
        method: 'POST',
        url: t.data.config.api_url + 'api/v1/mall/cart',
        header: {
          'content-type': 'application/json', // 默认值
          'Authorization': wx.getStorageSync('Token')
        },
        data: listdata,
        success: function (res) {
          res = res.data;
          if (res.ReturnCode == '200') {
            t.setData({
              csize: false
            })
            t.msgShow('成功加入购物车', 1)
          } else {
            t.msgShow(res.Msg)
          }
        }
      })
    }
  },
  coll:function(){
    var t=this;
  
    app.checkUser(function(){
      t.collAjax()
    })
  },
  //收藏
  collAjax: function () {
    let t = this;
    

    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/mall/collect/' + t.data.id,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.msgShow('收藏成功')

          t.setData({
            'info.HasCollect': true
          })
        }else if (res.ReturnCode == '401'){

        } 
        else {
          t.msgShow(res.Msg)
          
        }
      }
    })
  },
  //购物车
  goshopc:function(){
    app.checkUser(function () {
      wx.reLaunch({
        url: '../shopcar/shopcar'
      })
    }) 
  },
  upload: function () {
    let t = this;
    console.log(3333);
    t.setData({
      'evaluatesData.PageNo': Number(t.data.evaluatesData.PageNo) + 1
    })
    if (t.data.evaluatesData.PageNo > t.data.allPage) {
      app.load.hide();
    } else {
      setTimeout(function () {

      }, 500)
      app.load.show();
      t.evaluateAjax();
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
  },
  onShareAppMessage: function (res) {
    let t = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '千多利商城',
      path: '/pages/productsInfo/productsInfo?id='+t.data.id,
      success: function (res) {
        // t.msgShow('转发成功')
        // 转发成功
      },
      fail: function (res) {
        // t.msgShow('转发失败')
        // 转发失败
      }
    }
  }
})