// pages/serviceTime/serviceTime.js
let app = getApp();
app.load.show();
Page({
  data: {
    config:app.config,
    id:'',
    info:{},
    appoint:{},
    appointData:{
      Id:'',
      Date:''
    },
    getDate:'', //选择的日期
    getHourRange:'',  //选择的时间
    getHourId: '',//选择时间段的id
    weeks: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    nowDate: {
      dateTime: '',
      year: '',
      month: '',
      date: '',
      day: ''
    },  //今天日期
    othersDate: {
      twoDay: {},
      threeDay: {},
      fourDay: {},
      fiveDay: {},
      sixDay: {},
      sevenDay: {}
    },   //后面6天日期
    navIndex: '1',  //第几天
    lastTimeIndex: '-1',  //第几个时间
    nowTime:new Date().getTime(),
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    t.setData({
      // id: 'eee261f7-69e6-417a-a7c2-f8250c6bd3e6',
      // 'appointData.Id': 'eee261f7-69e6-417a-a7c2-f8250c6bd3e6'
      
      id: options.id,
      'appointData.Id': options.id
    })
    t.getNowTime();
    t.getOthersTime();
    t.infoAjax();
    t.appointMent();
    console.log(t.data.nowTime)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let t=this;
    
  },
  chioce: function () {

  },
  infoAjax: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/mall/servicegoods/' + t.data.id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.setData({
            info: res.Data
            
          })

        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  appointMent:function(){
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/mall/service/appointment_time',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: t.data.appointData,
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          var maxNum = res.Data.SystemCount;
          for (var i = 0; i < res.Data.AppointmentTime.length;i++){
            if (res.Data.AppointmentTime[i].Count<maxNum){
              res.Data.AppointmentTime[i].numDisable =false;
            }else{
              res.Data.AppointmentTime[i].numDisable = true;
            }
          }
          t.setData({
            appoint: res.Data
          })
          console.log(t.data.appoint)
          app.load.hide();
        } else {
          t.msgShow(res.Msg)
        }

      }
    })
    
  },
  getNowTime: function () {
    //得到今天的日期
    let t = this;
    let date = new Date();
    let day = date.getDate()
    let nowDate = {
      dateTime: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      day: t.data.weeks[date.getDay()]
    }
    t.setData({
      nowDate: nowDate,
      'appointData.Date': nowDate.dateTime
    })
    // t.toNowTime(t.data.nowDate.dateTime);
  },
  getOthersTime: function () {    //得到剩余的日期
    let t = this;
    let date = new Date();
    let dateTwo = new Date((date.getTime() + 60 * 60 * 24 * 1000));  //明天
    let dateThree = new Date((date.getTime() + 60 * 60 * 24 * 1000 * 2)); //第三天
    let dateFour = new Date((date.getTime() + 60 * 60 * 24 * 1000 * 3));//第四天
    let dateFive = new Date((date.getTime() + 60 * 60 * 24 * 1000 * 4));  //第五天
    let dateSix = new Date((date.getTime() + 60 * 60 * 24 * 1000 * 5));  //第六天
    let dateSeven = new Date((date.getTime() + 60 * 60 * 24 * 1000 * 6));  //第七天

    console.log(dateTwo)
    let othersDate = {
      twoDay: {
        dateTime: dateTwo.getFullYear() + '/' + (dateTwo.getMonth() + 1) + '/' + dateTwo.getDate(),
        year: dateTwo.getFullYear(),
        month: dateTwo.getMonth() + 1,
        date: dateTwo.getDate(),
        day: t.data.weeks[dateTwo.getDay()]
      },
      threeDay: {
        dateTime: dateThree.getFullYear() + '/' + (dateThree.getMonth() + 1) + '/' + dateThree.getDate(),
        year: dateThree.getFullYear(),
        month: dateThree.getMonth() + 1,
        date: dateThree.getDate(),
        day: t.data.weeks[dateThree.getDay()]
      },
      fourDay: {
        dateTime: dateFour.getFullYear() + '/' + (dateFour.getMonth() + 1) + '/' + dateFour.getDate(),
        year: dateFour.getFullYear(),
        month: dateFour.getMonth() + 1,
        date: dateFour.getDate(),
        day: t.data.weeks[dateFour.getDay()]
      },
      fiveDay: {
        dateTime: dateFive.getFullYear() + '/' + (dateFive.getMonth() + 1) + '/' + dateFive.getDate(),
        year: dateFive.getFullYear(),
        month: dateFive.getMonth() + 1,
        date: dateFive.getDate(),
        day: t.data.weeks[dateFive.getDay()]
      },
      sixDay: {
        dateTime: dateSix.getFullYear() + '/' + (dateSix.getMonth() + 1) + '/' + dateSix.getDate(),
        year: dateSix.getFullYear(),
        month: dateSix.getMonth() + 1,
        date: dateSix.getDate(),
        day: t.data.weeks[dateSix.getDay()]
      },
      sevenDay: {
        dateTime: dateSeven.getFullYear() + '/' + (dateSeven.getMonth() + 1) + '/' + dateSeven.getDate(),
        year: dateSeven.getFullYear(),
        month: dateSeven.getMonth() + 1,
        date: dateSeven.getDate(),
        day: t.data.weeks[dateSeven.getDay()]
      }
    }

    t.setData({
      othersDate: othersDate
    })

    console.log(t.data.othersDate)
  },
  chioceDate: function (e) {  //日期切换
    let t = this;
    t.setData({
      navIndex: e.currentTarget.dataset.index,
      'appointData.Date': e.currentTarget.dataset.date
    })
    t.appointMent();
    console.log(e)
    // t.toNowTime(e.currentTarget.dataset.date);
  },
  chioceLastTime: function (e) { //选择最后时间
    let t = this;
    console.log(e)
    t.setData({
      lastTimeIndex: e.currentTarget.dataset.index,
      getHourRange: e.currentTarget.dataset.hour,
      getHourId: e.currentTarget.dataset.hourid
    })
  },
  submit:function(){
    let t=this;
    if (t.data.lastTimeIndex<0){
      t.msgShow('请选择时间',1);
      return false;
    }
    wx.navigateTo({
      url: '../serviceConfirm/serviceConfirm?id=' + t.data.id + '&date=' + t.data.appointData.Date + '&hour=' + t.data.getHourRange + '&hourId=' + t.data.getHourId,
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