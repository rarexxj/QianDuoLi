// pages/productsList/productsList.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    openPicker: false,
    needAnimation: false,
    contentHeight: 0,
    screensta: false,
    curIndex: '0',
    categoryBtn:false,
    navList: [
      {
        value: '综合排序'
      },
      {
        value: '价格从低到高'
      },
      {
        value: '价格从高到低'
      }
    ],
    datas: {
      CategoryId: '',//分类Id
      SortType: '0',
      PageNo: '1',
      Limit: '8',
      MinPrice: '',
      MaxPrice: '',
      KeyWord:''
    },
    info: [],
    filterInfo: [],
    allPage:'',
    searchValue:'',
    searchBtn:false,
    msgShow: false,
    msgTitle: '',
    tags:{},
    closeBtn:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.load.show();
    console.log(options)
    let t = this;
    t.setData({
      'datas.CategoryId': options.id,
      'datas.KeyWord': options.KeyWord
    })
    if(options.id){
      t.setData({
        categoryBtn: true
      })
    }
    if(options.to){
      t.setData({
        searchBtn: true,
        closeBtn:false
      })
    }

    t.infoAjax();
    t.tags();
    // t.filterCriterias();  分类
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  infoAjax: function () {
    let t = this;
    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/mall/goods',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: t.data.datas,
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.data.allPage = Math.ceil(res.Data.Count / t.data.datas.Limit)
          t.setData({
            info: res.Data.Goods,
            allPage:t.data.allPage
          })
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }
      }
    })
  },
  loadAjax:function(){
    let t = this;
    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/mall/goods',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: t.data.datas,
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.data.allPage = Math.ceil(res.Data.Count / t.data.datas.Limit)
          t.setData({
            info: t.data.info.concat(res.Data.Goods),
            allPage: t.data.allPage
          })
          console.log(t.data.info)
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }
      }
    })
  },
  filterCriterias: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/mall/goods/filtercriterias',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        CategoryId: t.data.datas.CategoryId
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.setData({
            filterInfo: res.Data
          })
        } else {
          t.msgShow(res.Msg)
        }
      }
    })
  },
  upLoad: function () {
    let t = this;
    console.log(3333);
    t.setData({
      'datas.PageNo': Number(t.data.datas.PageNo) + 1
    })
    console.log(t.data.datas.PageNo)
    console.log(t.data.allPage)
    if (t.data.datas.PageNo>t.data.allPage){
      app.load.hide();
    }else{
      setTimeout(function(){
        
      },500)
      app.load.show();
      t.loadAjax();
    }
    
  },
  onPickHeaderClick: function () {
    let t = this;
    if (!(t.data.screensta)) {
      t.setData({
        openPicker: !t.data.openPicker,
        needAnimation: true,
        screensta: false
      })
    }
  },
  navChoose: function (e) {
    let t = this;
    console.log(e)
    t.setData({
      info:[],
      curIndex: e.currentTarget.dataset.nsorttype,
      openPicker: false,
      'datas.SortType': e.currentTarget.dataset.nsorttype,
      'datas.PageNo':'1'
    });
    t.infoAjax();
  },
  searchtext: function (e) {
    let t = this;
    t.setData({
      'datas.KeyWord': e.detail.value
    })
  },
  tagText:function(e){
    let t = this;
    t.setData({
      'datas.KeyWord': e.currentTarget.dataset.item,
      searchBtn: false,
      'datas.PageNo': 1
    })
    t.infoAjax()
  },
  search: function () {
    let t = this;
    app.load.show();
    t.setData({
      'datas.PageNo': 1,
      searchBtn: false
    })
    t.infoAjax()
  },
  close:function(){
    let t = this;
    t.setData({
      searchBtn: false
    })
  },
  goSearch:function(){
    let t=this;
    t.setData({
      searchBtn:true
    })
  },
  tags:function(){
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/goods/tags/BntWeb-Mall',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.setData({
            tags: res.Data
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
  // sift: function (e) {   筛选
  //   let t = this;
  //   console.log(e)
  //   if (e.currentTarget.dataset.choose == 'false') {
  //     t.setData({
  //       screensta: true
  //     })
  //   }
  // },
  // paixu() {
  //   let t = this
  //   t.setData({
  //     screensta: false
  //   })
  // }
})