// pages/set/set.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:app.config,
    avator:'',
    info:{},
    birthday:'',
    id:'',  //会员id
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t=this;
    app.load.show();
    t.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  setPhotoInfo:function(){
    var t=this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        wx.uploadFile({
          url: t.data.config.api_url + 'api/v1/file', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            var data = res.data;
            data = JSON.parse(data);
            console.log(typeof data);
            t.upAvatar(data, tempFilePaths);
            //do something
          }
        })


        
        
        
      }
    })
  },
  upAvatar: function (data,tempFilePaths){
    let t=this;
    
    wx.request({
      method: 'PUT',
      url: t.data.config.api_url + 'api/v1/member/'+t.data.id+'/avatar',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: {
        AvatarId: data.Data[0].Id
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          console.log(res)
          t.setData({
            avator: res.Data.RelativePath
          })
        } else {
          t.msgShow(res.Msg)
        }
      },
      fail:function(res){
        console.log(res)
      }
    })
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
          t.setData({
            info: res.Data.Member,
            birthday: res.Data.Member.Birthday.split(' ')[0],
            avator: res.Data.Member.Avatar.RelativePath,
            id:res.Data.Member.Id
          })
          app.load.hide();
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