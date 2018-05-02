// pages/productsInfoService/productsInfoService.js
let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:app.config,
    navBtn:'1',
    info:{},
    id:'',
    evaluatesData:{
      GoodsId: '',
      PageNo: 1,
      Limit: 5
    },
    evaluateInfo:[],
    allPage: '',
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t=this;
    app.checkLogin();
    t.setData({
      id:options.id,
      'evaluatesData.GoodsId': options.id
    })
    t.infoAjax();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  navClick:function(event){
    var t=this;
    t.setData({
      navBtn:event.currentTarget.dataset.id
    })
  },
  infoAjax: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/mall/servicegoods/' + t.data.id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          res.Data.Description = res.Data.Description.replace(/<img src="\//g, '<img style="width:100% !important" src="' + t.data.config.api_url+'/')

          res.Data.Description = res.Data.Description.replace(/<img/g, '<img style="width:100% !important"')
          t.setData({
            info: res.Data
          })
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
      url: t.data.config.api_url + 'api/v1/mall/servicegoods_evaluates',
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
  toOrder:function(){
    let t=this;
    app.checkUser(function () {
      if (!wx.getStorageSync('UserInfo').Phone) {
        t.msgShow('请绑定手机号', 1, function () {
          wx.navigateTo({
            url: '../bindNewPhone/bindNewPhone?from=fuwu'+'&id='+t.data.id
          })
        })
      } else {
        wx.navigateTo({
          url: '../serviceTime/serviceTime?id=' + t.data.id,
        })
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
  },
  onShareAppMessage: function (res) {
    let t = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '千多利商城',
      path: '/pages/productsInfoService/productsInfoService?id='+t.data.id,
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