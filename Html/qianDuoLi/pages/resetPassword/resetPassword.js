// pages/resetPassword/resetPassword.js
let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    oldPass:'',
    newPass:'',
    newPass2:'',
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  oldInput(e) {
    var t = this;
    t.setData({
      oldPass: e.detail.value
    })
  },
  newInput(e) {
    var t = this;
    t.setData({
      newPass: e.detail.value
    })
  },
  newInput2(e){
    var t = this;
    t.setData({
      newPass2: e.detail.value
    })
  },
  submit:function(){
    let t=this;
    if (t.data.newPass != t.data.newPass2){
      t.msgShow('密码输入不一致');
      return false;
    }
    wx.request({
      method: 'PUT',
      url: t.data.config.api_url + 'api/v1/member/reset_password',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: {
        Password: t.data.newPass,
        NewPassword: t.data.newPass2
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.msgShow('修改成功', 1, function () {
            wx.redirectTo({
              url: '../set/set'
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