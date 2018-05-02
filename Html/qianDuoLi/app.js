//app.js
let CryptoJS = require('./libs/aes');
// let b=require('./libs/enc-base64-min');
// e.currentTarget.dataset.index
let url = 'https://chongwuyongpin.yijingkeji.com.cn/';

App({
  config: {
    api_url: url,
    static_url: url + 'Html/images/'
  },
  loginFun: '',
  SDKVersion: '1.5.0',
  canIUse: wx.canIUse('getSystemInfoSync'),
  SystemInfo: wx.getSystemInfoSync(),
  userInfo: '',
  InvitationCode: '',
  onLaunch: function (options) {
    console.log(options)
  },
  //加密
  Encrypt: (word) => {
    //base64
    let strObj = CryptoJS.enc.Utf8.parse(str);
    return CryptoJS.enc.Base64.stringify(strObj);
  },
  //解密
  Decrypt: (word) => {
    //base64
    let strObj = CryptoJS.enc.Base64.parse(word);
    let str = strObj.toString(CryptoJS.enc.Utf8);
    return str;
  },
  //loading动画
  load: {
    show: (title = '加载中', mask = true) => {
      wx.showLoading({
        title: title,
        mask: mask
      });
    },
    hide: () => {
      wx.hideLoading();
    }
  },
  //检测登录
  checkLogin(fun) {
    let _this = this;
    console.log(_this.SystemInfo.SDKVersion)
    //检测版本号
    if (_this.SystemInfo.SDKVersion >= _this.SDKVersion && _this.canIUse) {
      _this.loginFun = fun;
      wx.checkSession({
        success: (res) => {
          // _this.load.show('');
          _this.getUserInfo();
        },
        fail: () => {
          console.log(111)
          // _this.load.show('登录中');
          _this.login();
        }
      })
    } else {
      _this.load.hide();
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请升级后再使用。',
        showCancel: false,
        success: () => {
          _this.load.show('请升级微信版本', true);
        }
      });
    }

  },
  //登录
  login() {
    let _this = this;

    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: url + 'api/v1/weixin/session_key',
            data: {
              Code: res.code
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data);
              if (res.data.ReturnCode == '200') {
                wx.setStorageSync('SessionKey', res.data.Data.SessionKey);
                _this.getUserInfo();
              } else {
                _this.msg.show(res.data.Msg)
              }

            }
          })

        }

      },
      fail: (res) => {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    });
  },
  //是否授权获取用户信息
  getSettingUserInfo(callback) {
    let _this = this;

    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          console.log(8888)
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          _this.getUserInfo(callback);

        } else {
          console.log(7777)
          _this.openAuthorize();
        }
      }
    })
  },
  //获取用户信息
  getUserInfo(callback) {
    let _this = this;
    console.log('获取用户信息')
    _this.load.hide();
    wx.getUserInfo({
      withCredentials: false,
      success: res => {
        wx.request({
          method: 'POST',
          url: url + 'api/v1/weixin/login_auth',
          header: {
            'content-type': 'application/json' // 默认值
          },
          data: {
            Avatar: res.userInfo.avatarUrl,
            Nickname: res.userInfo.nickName,
            Sex: res.userInfo.gender,
            SessionKey: wx.getStorageSync('SessionKey'),
            InvitationCode: wx.getStorageSync('FatherCode') ? wx.getStorageSync('FatherCode') : ''
          },
          success: function (res) {
            res = res.data;
            console.log(res)
            if (res.ReturnCode == '200') {
              //保存用户信息
              wx.setStorageSync('UserInfo', res.Data);
              wx.setStorageSync('Token', res.Data.Token)
              if (typeof (callback) == 'function') {
                setTimeout(function () {
                  callback()
                }, 3000)
              }
            } else {
              _this.login()
            }
          },
          fail:function(res){
            console.log(JSON.stringify(res));
          }
        })

        console.log(res)
        // _this.load.hide();
        _this.userInfo = res.userInfo;
        if (typeof _this.loginFun === 'function') _this.loginFun();



      },
      fail: () => {
        // _this.openAuthorize();
      }
    })
  },
  //授权
  openAuthorize(callback) {
    let _this = this;

    console.log(123)
    wx.showModal({
      title: '提示',
      content: '为了您能正常使用小程序，请允许获取用户信息',
      success: (res) => {
        if (res.confirm) {
          wx.openSetting({
            success: () => {
              _this.getSettingUserInfo(callback);
            }
          });
        } else {

          console.log(33333)
          setTimeout(() => {
            // _this.openAuthorize();
          },500);
        }
      }
    });
  },
  checkUser: function (callbackSuccess,callback) {
    let t = this;
    if (wx.getStorageSync('Token')) {
      if (typeof (callbackSuccess) == 'function') {
        callbackSuccess();
      }
    } else {
      console.log('checkUser')
      t.openAuthorize(callback)
    }
  },
  //ajax
  ajax(obj) {
    let _this = this;
    let {
            url = '',
      data = {},
      header = {
        'content-type': 'application/json'
      },
      success = () => {
      },
      fail = () => {
      },
      complete = () => {
      }
        } = obj;

    wx.request({
      url: url,
      data: {
        content: _this.Encrypt(data)
      },
      header: header,
      success: (res) => {

        success(res);
      },
      fail: (res) => {

        _this.msg.show(res.errMsg);

        fail(res);
      },
      complete: (res) => {

        complete(res);
      },
    })
  },
  onLaunch: function () {

  },
  globalData: {
    userInfo: null
  },
  //消息框
  msg: {
    show: (title, time, callback) => {
      wx.showToast({
        title: title,
        image: '/images/ico25.png',
        mask: true,
        duration: time ? time * 1000 : 2000,
        success: function (res) {
          if (typeof (callback) == 'function') {
            setTimeout(function () {
              callback()
            }, 3000)
          } else {

          }
        }
      })
    },
    tip: (title, time, callback) => {
      wx.showToast({
        title: title,
        ico: 'success',
        mask: true,
        duration: time ? time * 1000 : 2000,
        success: function (res) {
          if (typeof (callback) == 'function') {
            setTimeout(function () {
              callback()
            }, 2000)
          } else {

          }
        }
      })
    }
  },
})