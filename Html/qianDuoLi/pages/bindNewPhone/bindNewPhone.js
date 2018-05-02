// pages/bindNewPhone/bindNewPhone.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    oldTel: '',
    messageOne: '',
    messageTwo: '',
    newTel: '',

    codeDis: false,
    phoneCode: "获取验证码",

    codeDis2: false,
    phoneCode2: "获取验证码",

    msgShow: false,
    msgTitle: '',

    from:'',
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t=this;
    t.setData({
      from: options.from,
      id:options.id
    })
    
  },
  oldTelInput(e) {
    var t = this;
    t.setData({
      oldTel: e.detail.value
    })
  },
  messageInput(e) {
    var t = this;
    t.setData({
      messageOne: e.detail.value
    })
  },
  newTelInput(e) {
    var t = this;
    t.setData({
      newTel: e.detail.value
    })
  },
  messageInput2(e) {
    var t = this;
    t.setData({
      messageTwo: e.detail.value
    })
  },
  get() {
    var t = this;
    // if (!t.data.oldTel) {
    //   t.msgShow('请输入原手机号')
    //   return false
    // }
    if (t.data.oldTel.length != 11) {
      t.msgShow('请输入正确的手机号')
      return false
    }

    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/member/send_sms',
      header: {
        'content-type': 'application/json', // 默认值
      },
      data: {
        Phone: t.data.oldTel,
        Type:'2'
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.msgShow('验证码发送成功', 1, function () {
            
            t.setData({
              codeDis: true
            })


            // ajax
            t.setData({
              phoneCode: 60
            })
            let time = setInterval(() => {
              t.data.phoneCode--
              t.setData({
                phoneCode: t.data.phoneCode
              })

              if (t.data.phoneCode == 0) {
                clearInterval(time)
                t.setData({
                  phoneCode: "获取验证码",
                  codeDis: false
                })
              }

            }, 1000)

          })
        } else {
          t.msgShow(res.Msg)
        }
      }
    })

    
  },
  get2() {
    var t = this;

    if (!t.data.newTel) {
      t.msgShow('请输入新手机号')
      return false
    }
    if (t.data.newTel.length != 11) {
      t.msgShow('请输入正确的手机号')
      return false
    }

    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/member/send_sms',
      header: {
        'content-type': 'application/json', // 默认值
      },
      data: {
        Phone: t.data.newTel,
        Type: '2'
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.msgShow('验证码发送成功', 1, function () {
            t.setData({
              codeDis2: true
            })

            // ajax
            t.setData({
              phoneCode2: 60
            })
            let time = setInterval(() => {
              t.data.phoneCode2--
              t.setData({
                phoneCode2: t.data.phoneCode2
              })

              if (t.data.phoneCode2 == 0) {
                clearInterval(time)
                t.setData({
                  phoneCode2: "获取验证码",
                  codeDis2: false
                })
              }
            }, 1000)
          })
        } else {
          t.msgShow(res.Msg)
        }
      }
    }) 
  },
  submit() {
    var t = this;
   
    // if (!t.data.oldTel) {
    //   t.msgShow('请输入原手机号')
    //   return false
    // }
    // if (!t.data.messageOne) {
    //   t.msgShow('请输入验证码')
    //   return false
    // }
    if (!t.data.newTel) {
      t.msgShow('请输入新手机号')
      return false
    }
    if (!t.data.messageTwo) {
      t.msgShow('请输入验证码')
      return false
    }
    wx.request({
      method: 'PUT',
      url: t.data.config.api_url + 'api/v1/member/phone',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: {
        // Phone: t.data.oldTel,
        NewPhone: t.data.newTel,
        NewSmsCode: t.data.messageTwo
        // NewSmsVerifyCode: t.data.messageTwo
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.msgShow('修改成功', 1, function () {
            var info = wx.getStorageSync('UserInfo');
            info.Phone = t.data.newTel;
            wx.setStorageSync('UserInfo', info);
            if (t.data.from=='wallet'){
              wx.redirectTo({
                url: '../wallet/wallet'
              })
            } else if (t.data.from =='partner'){
              wx.redirectTo({
                url: '../partner/partner'
              })
            } else if (t.data.from == 'fuwu') {
              wx.redirectTo({
                url: '../productsInfoService/productsInfoService?id='+t.data.id
              })
            }else{
              wx.reLaunch({
                url: '../center/center'
              })
            }
            
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