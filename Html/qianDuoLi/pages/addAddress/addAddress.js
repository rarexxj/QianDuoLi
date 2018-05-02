// var json=require('../../josn/json.js');
// var provincialCity={}   //存放临时选择的省市区;
let app = getApp();
Page({
  data: {
    id: '',
    gid: '',
    config: app.config,
    name: '',
    phone: '',
    zipCode: '',
    addressInfo: '',
    region: '',
    substa: false,

    msgShow: false,
    msgTitle: ''
  },
  name(e) {
    var t = this;
    t.setData({
      name: e.detail.value
    })
  },
  phone(e) {
    var t = this;
    t.setData({
      phone: e.detail.value
    })
  },
  zipCode(e) {
    var t = this;
    t.setData({
      zipCode: e.detail.value
    })
  },
  addressInfo(e) {
    var t = this;
    t.setData({
      addressInfo: e.detail.value
    })
  },
  onLoad: function (options) {
    let t = this;
    console.log(options)
    t.setData({
      id: options.id,
      gid: options.gid
    })
  },
  bindRegionChange: function (e) {
    let t = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (e.detail.value[0].indexOf('天津') > -1) {
      e.detail.value[0] = '天津'
    }
    if (e.detail.value[0].indexOf('重庆') > -1) {
      e.detail.value[0] = '重庆'
    }
    if (e.detail.value[0].indexOf('上海') > -1) {
      e.detail.value[0] = '上海'
    }
    if (e.detail.value[0].indexOf('北京') > -1) {
      e.detail.value[0] = '北京'
    }
    this.setData({
      region: e.detail.value
    })

    console.log(t.data.region)
  },
  submit: function () {
    var t = this;
    if (t.data.substa) {
      return false;
    }
    if (!t.data.name) {
      t.msgShow('请填写姓名')
      return false
    }
    if (!t.data.phone) {
      t.msgShow('请填写手机')
      return false
    }
    if (!t.data.zipCode) {
      t.msgShow('请填写邮编')
      return false
    }

    if (!t.data.region) {
      t.msgShow('请选择省市区')
      return false
    }
    if (!t.data.addressInfo) {
      t.msgShow('请填写地址')
      return false
    }
    var data = {
      Address: t.data.addressInfo,
      Contacts: t.data.name,
      Phone: t.data.phone,
      Province: t.data.region[0],
      City: t.data.region[1],
      District: t.data.region[2],
      Street: '',
      IsDefault: true,
      RegionName: t.data.region[0] + ',' + t.data.region[1] + ',' + t.data.region[2]
    }
    t.data.substa = true;

    wx.request({
      method: 'POST',
      url: t.data.config.api_url + 'api/v1/member/address',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': wx.getStorageSync('Token')
      },
      data: data,
      success: function (res) {
        res = res.data;
        console.log(res)
        if (res.ReturnCode == '200') {
          t.msgShow('保存成功', 1, function () {
            if (t.data.id) {
              wx.redirectTo({
                url: '../confirm/confirm?id=' + t.data.id,
              })
            } else if (t.data.gid) {
              wx.redirectTo({
                url: '../confirm/confirm?gid=' + t.data.gid,
              })
            } else {
              wx.redirectTo({
                url: '../address/address',
              })
            }
          });
          t.data.substa = false;

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