// pages/sex/sex.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    info:[
      {
        sex:'男'
      },
      {
        sex: '女'
      }
    ],
    curIndex:'',
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  choose:function(e){
    var t=this;
    t.setData({
      curIndex: e.currentTarget.dataset.index
    })
  },
  fix: function () {
    let t = this;
    if (!t.data.curIndex){
      t.msgShow('请选择性别');
      return false;
    }
    wx.request({
      method: 'PUT',
      url: t.data.config.api_url + 'api/v1/member/info',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: {
        Sex: t.data.curIndex
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.msgShow('修改成功', 1, function () {
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