// pages/checkComment/checkComment.js
let app=getApp();
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
    var t=this;
    t.setData({
      id:options.id
    })
    t.evaInfo();
    // t.shuxin();
  },
  evaInfo:function(){
    let t=this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/order/' + t.data.id + '/evaluate',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.setData({
            info:res.Data
          })
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  shuxin(){
    let t=this;
     
    for(let i=0;i<t.data.goods.length;i++){
      t.data.goods[i].shuxin = t.data.goods[i].GoodsAttribute.split(',');
      t.setData({
        goods: t.data.goods
      })
      
    }
    console.log(t.data.goods)
    
  },
  scale: function (e) {
    let t = this;
    console.log(e)
      //获取当前图片的下表
    let inindex = e.currentTarget.dataset.index;
    let outIndex = e.currentTarget.dataset.outindex;
      //数据源
    let img_arr = t.data.info;
    wx.previewImage({
      //当前显示下表
      current: img_arr[outIndex].EvaluateImages[inindex],
      //数据源
      urls: img_arr[outIndex].EvaluateImages
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