// pages/searchList/searchList.js
let app=getApp();
app.load.show();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:app.config,
    searchValue:'',
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  searchtext:function(e){
    let t=this;
      console.log(e)
      t.setData({
        searchValue: e.detail.value
      })
  },
  search:function(){
    let t=this;
    wx.navigateTo({
      url: '../productsList/productsList?key=' + t.data.searchValue,
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