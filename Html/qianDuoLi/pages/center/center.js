// pages/center/center.js
let app = getApp()
app.load.show();
Page({
  data: {
    config: app.config,
    info: {},
    head: '',
    gz: false,
    msgShow: false,
    msgTitle: '',
    loadT: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let t = this;
    let loadT = this.data.loadT;
  
    app.checkUser(function () {
      app.load.show();
      t.init();
    });

    this.setData({
      loadT: 1
    });
  },
  onShow: function () {
    let t = this;
    let loadT = this.data.loadT;

    loadT++;
    this.setData({
      loadT: loadT
    });

    if (loadT > 2) {
      t.init();
    }
  },
  init: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/member/info',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          console.log(res.Data.Member.Phone)
          if (res.Data.Member.Phone == null) {
            res.Data.Member.Phone = ''
          }
          t.setData({
            info: res.Data,
            head: res.Data.Member.Avatar.RelativePath
          })
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }
      }
    })
  },
  follow: function () {
    var t = this;
    t.setData({
      gz: true
    })
  },
  layerClose: function () {
    var t = this;
    t.setData({
      gz: false
    })
  },
  saveImgToPhotosAlbumTap: function () {
    let t=this;
    wx.downloadFile({
      url: t.data.config.static_url + 'img14.jpg',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log(res)
          },
          fail: function (res) {
            console.log(res)
            console.log('fail')
          }
        })
      },
      fail: function () {
        console.log('fail')
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