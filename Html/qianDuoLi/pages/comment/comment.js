// pages/comment/comment.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: app.config,
    id: '',
    info: {},
    type: '',  //1 服务型
    stars: [0, 1, 2, 3, 4],
    msgShow: false,
    msgTitle: '',
    img_arr: [],
    imgData: {
      successUp: 0, //成功个数
      failUp: 0, //失败个数
      length: 0,//总共个数
      i: 0 //第几个
    },
    imgId: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    t.setData({
      // id: '2110e8a8-fe8a-4f8d-a22c-d320bfc7c7c3'
      id: options.id,
      type: options.type
    })
    t.orderInfo();
  },
  orderInfo: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/mall/order/' + t.data.id,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          for (var i = 0; i < res.Data.OrderGoods.length; i++) {
            res.Data.OrderGoods[i].stars = 5;
            res.Data.OrderGoods[i].eval = '';
            res.Data.OrderGoods[i].upImg = [];
            res.Data.OrderGoods[i].upId = [];
          }
          t.setData({
            info: res.Data
          })
          console.log(t.data.info)
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }

      }
    })

  },
  clickStars: function (e) {
    let t = this;
    console.log(e)
    t.data.info.OrderGoods[e.currentTarget.dataset.indexout].stars = e.currentTarget.dataset.index + 1
    t.setData({
      info: t.data.info
    })
    console.log(t.data.info)
  },
  bindTextAreaInput: function (e) {
    let t = this;
    console.log(e.detail.value)
    t.data.info.OrderGoods[e.currentTarget.dataset.indexout].eval = e.detail.value
    console.log(e)
    t.setData({
      info: t.data.info
    })
  },
  upimg: function (e) {
    let t = this;
    console.log(e.currentTarget.dataset.indexout)
    t.setData({
      imgData: {
        successUp: 0, //成功个数
        failUp: 0, //失败个数
        length: 0,//总共个数
        i: 0 //第几个
      }
    })
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      count: 4,
      success: function (res) {
        console.log(res.tempFilePaths)
        // t.data.info.OrderGoods[e.currentTarget.dataset.indexout].upImg = [];
        // t.data.info.OrderGoods[e.currentTarget.dataset.indexout].upId = [];
        t.data.info.OrderGoods[e.currentTarget.dataset.indexout].upImg = t.data.info.OrderGoods[e.currentTarget.dataset.indexout].upImg.concat(res.tempFilePaths)
        t.setData({
          info: t.data.info,
          'imgData.length': res.tempFilePaths.length
        })
        console.log(e.currentTarget.dataset.indexout)
        t.imgUpFile(e.currentTarget.dataset.indexout)
      }
    })

  },
  xxx: function (e) {
    let t = this;
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let outIndex = e.currentTarget.dataset.indexout;
    console.log(outIndex)
    t.data.info.OrderGoods[outIndex].upImg.splice(index, 1)
    t.data.info.OrderGoods[outIndex].upId.splice(index, 1)
    t.setData({
      info: t.data.info
    })
    console.log(t.data.info)
  },
  scale: function (e) {
    let t = this,
      //获取当前图片的下表
      index = e.currentTarget.dataset.index,
      //数据源
      img_arr = t.data.img_arr;
    wx.previewImage({
      //当前显示下表
      current: img_arr[index],
      //数据源
      urls: img_arr
    })
  },
  submit: function () {
    let t = this;
    let data1 = [];
    for (var i = 0; i < t.data.info.OrderGoods.length; i++) {
      var obj = t.data.info.OrderGoods[i];
      // if (!obj.eval){
      //   t.msgShow('请填写评价');
      //   return false
      // }
      // if (obj.Score<1) {
      //   t.msgShow('请打分');
      //   return false
      // }

      // for (var j = 0; j < data.Data.length; j++) {
      //   datas.Evaluates[i].FilesId = datas.Evaluates[i].FilesId.concat(data.Data[j].Id)
      // }

      var data2 = {
        // orderId:id,
        SingleGoodsId: obj.SingleGoodsId,
        Score: obj.stars,
        Content: obj.eval.toString(),
        FilesId: obj.upId
      }
      data1.push(data2)
    }

    let datas = {
      'Evaluates': data1
    }
    
    // return false;
    t.submitLast(datas)
  },
  imgUpFile: function (cindex) {
    let t = this;
    wx.uploadFile({
      url: t.data.config.api_url + 'api/v1/file', //仅为示例，非真实的接口地址
      filePath: t.data.info.OrderGoods[cindex].upImg[t.data.imgData.i],
      name: 'file',

      success: function (res) {
        var data = res.data;
        data = JSON.parse(data);
        console.log(data)
        t.data.info.OrderGoods[cindex].upId = t.data.info.OrderGoods[cindex].upId.concat(data.Data[0].Id)
        let a = parseFloat(t.data.imgData.successUp);
        t.setData({
          'imgData.successUp': a + 1,
          info: t.data.info
        })
        console.log(t.data.info)
      },
      fail: (res) => {
        console.log(res)
        let a = parseFloat(t.data.imgData.failUp);
        t.setData({
          'imgData.failUp': a + 1
        })
      },
      complete: (res) => {
        console.log(res)
        let a = parseFloat(t.data.imgData.i);
        t.setData({
          'imgData.i': a + 1
        })
        console.log(t.data.imgData)
        if (t.data.imgData.i == t.data.imgData.length) {
          // t.msgShow('总共' + t.data.imgData.successUp + '张上传成功,' + t.data.imgData.failUp + '张上传失败！');



          console.log(res)
        }
        else {  //递归调用uploadDIY函数
          t.imgUpFile(cindex);
        }
      }
    })
  },
  submitLast: function (datas) {
    let t = this;
    console.log(datas)
    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/order/' + t.data.id + '/evaluate',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: datas,
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.msgShow('评价成功', 1, function () {
            wx.reLaunch({
              url: '../center/center'
            })
            // if (t.data.type == 1) {
            //   wx.redirectTo({
            //     url: '../apporderList/apporderList'
            //   })
            // } else {
            //   wx.redirectTo({
            //     url: '../orderList/orderList'
            //   })
            // }
          })
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  switchChange: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
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