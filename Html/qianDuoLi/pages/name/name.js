// pages/name/name.js
let app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    config:app.config,
    nickName:'',
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t=this;
    // app.load.show();
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  name:function(e){
    let t=this;
    console.log(e);
    t.setData({
      nickName: e.detail.value
    })
  },
  fix:function(){
    let t = this;
    wx.request({
      method: 'PUT',
      url: t.data.config.api_url + 'api/v1/member/info',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data:{
        NickName: t.data.nickName
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.msgShow('修改成功',1,function(){
            wx.reLaunch({
              url: '../center/center'
            })
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